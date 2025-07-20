import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Exa from 'exa-js';
import { google } from 'googleapis';
import { Readable } from 'stream';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { currentUser } from '@clerk/nextjs/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const exa = new Exa(process.env.EXA_API_KEY);

// YouTube API setup with OAuth2 credentials from environment variables
let youtube: any = null;

try {
  if (process.env.GOOGLE_ACCESS_TOKEN && process.env.GOOGLE_REFRESH_TOKEN) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_TOKEN_URI
    );
    
    oauth2Client.setCredentials({
      access_token: process.env.GOOGLE_ACCESS_TOKEN,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      scope: process.env.GOOGLE_SCOPES,
      token_type: 'Bearer',
      expiry_date: process.env.GOOGLE_TOKEN_EXPIRY ? new Date(process.env.GOOGLE_TOKEN_EXPIRY).getTime() : undefined
    });
    
    youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client,
    });
    
    console.log('✅ YouTube OAuth2 credentials loaded from environment variables');
  } else {
    console.log('⚠️ Google OAuth2 tokens not found in environment - YouTube upload disabled');
  }
} catch (error) {
  console.error('❌ Error loading YouTube credentials:', error);
}

async function fetchImageBuffer(imageUrl: string): Promise<Buffer> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
}

async function createVideoBuffer(audioBuffer: Buffer, imageBuffer: Buffer): Promise<Buffer> {
  const tempDir = os.tmpdir();
  const audioPath = path.join(tempDir, `audio-${Date.now()}.mp3`);
  const imagePath = path.join(tempDir, `image-${Date.now()}.webp`);
  const videoPath = path.join(tempDir, `video-${Date.now()}.mp4`);
  
  try {
    fs.writeFileSync(audioPath, audioBuffer);
    fs.writeFileSync(imagePath, imageBuffer);
    
    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(audioPath)
        .input(imagePath)
        .inputOptions(['-loop 1'])
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([
          '-tune stillimage', 
          '-shortest',
          '-pix_fmt yuv420p',
          '-movflags +faststart'
        ])
        .on('end', () => {
          try {
            const videoBuffer = fs.readFileSync(videoPath);
            
            if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
            if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
            
            resolve(videoBuffer);
          } catch (readError) {
            reject(readError);
          }
        })
        .on('error', (err) => {
          if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
          if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
          if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
          reject(err);
        })
        .save(videoPath);
    });
  } catch (error) {
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    throw error;
  }
}

async function getOrCreatePlaylist(playlistTitle: string, playlistDescription: string = "Auto-created playlist"): Promise<string> {
  try {
    const playlists = await youtube.playlists.list({
      part: ['snippet'],
      mine: true,
      maxResults: 50,
    });

    const existingPlaylist = playlists.data.items?.find(
      (item: any) => item.snippet?.title === playlistTitle
    );

    if (existingPlaylist) {
      return existingPlaylist.id!;
    }

    const response = await youtube.playlists.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: playlistTitle,
          description: playlistDescription,
        },
        status: {
          privacyStatus: 'public',
        },
      },
    });

    return response.data.id!;
  } catch (error) {
    console.error('Error managing playlist:', error);
    throw error;
  }
}

async function addVideoToPlaylist(playlistId: string, videoId: string): Promise<void> {
  try {
    await youtube.playlistItems.insert({
      part: ['snippet'],
      requestBody: {
        snippet: {
          playlistId,
          resourceId: {
            kind: 'youtube#video',
            videoId,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error adding video to playlist:', error);
    throw error;
  }
}

function isYouTubeConfigured(): boolean {
  const hasTokens = !!(process.env.GOOGLE_ACCESS_TOKEN && process.env.GOOGLE_REFRESH_TOKEN);
  const hasYouTubeClient = youtube !== null;
  
  console.log('YouTube Configuration Check:', {
    hasTokens,
    hasYouTubeClient,
  });
  
  return hasTokens && hasYouTubeClient;
}

async function uploadToYouTube(videoBuffer: Buffer, title: string, description: string, keywords: string[], username: string = 'AI User'): Promise<{ youtubeUrl: string; videoId: string; playlistUrl?: string }> {
  if (!isYouTubeConfigured()) {
    throw new Error('YouTube upload not configured. Run youtube_auth_setup.py to authenticate.');
  }

  const tempDir = os.tmpdir();
  const videoPath = path.join(tempDir, `upload-${Date.now()}.mp4`);
  
  try {
    console.log(`📊 Preparing video upload: ${videoBuffer.length} bytes`);
    fs.writeFileSync(videoPath, videoBuffer);
    
    if (!fs.existsSync(videoPath)) {
      throw new Error(`Failed to create temporary video file: ${videoPath}`);
    }
    
    const enhancedDescription = `
This podcast was generated by AI using the latest research on: ${keywords.join(', ')}.

Generated with Podgenius - AI-powered podcast creation.
Topics covered: ${keywords.join(', ')}`;

    const video = {
      snippet: {
        title,
        description: enhancedDescription,
        tags: [...keywords, 'podcast', 'ai-generated', 'news', 'podgenius'],
        categoryId: '22',
      },
      status: {
        privacyStatus: 'public',
      },
    };

    console.log('📤 Starting YouTube upload...');
    const response = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: video,
      media: {
        body: fs.createReadStream(videoPath),
      },
    });

    const videoId = response.data.id!;
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    console.log('✅ YouTube upload successful:', youtubeUrl);
    
    let playlistUrl: string | undefined;
    
    try {
      const playlistTitle = `${username}'s AI Podcast Collection`;
      const playlistDescription = `AI-generated podcasts created with Podfox for ${username}`;
      const playlistId = await getOrCreatePlaylist(playlistTitle, playlistDescription);
      await addVideoToPlaylist(playlistId, videoId);
      playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;
      console.log('✅ Video added to playlist:', playlistUrl);
    } catch (playlistError) {
      console.warn('⚠️ Failed to add to playlist, but video uploaded successfully:', playlistError);
    }

    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
      console.log('✅ Temporary file cleaned up');
    }

    return {
      youtubeUrl,
      videoId,
      playlistUrl,
    };
  } catch (error) {
    console.error('❌ YouTube upload error:', error);
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1️⃣ Read and validate the incoming “keywords” field
    const { keywords, userId = 'default_user' } = await request.json();
    if (!keywords) {
      return NextResponse.json(
        { error: 'Keywords are required' },
        { status: 400 }
      );
    }

    // 2️⃣ Call your MCP-backed travel planner to get an itinerary
    const mcpUrl = process.env.TRAVEL_PLANNER_API_URL!; // e.g. "http://localhost:8001"
    const tripRes = await fetch(`${mcpUrl}/plan-trip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preferences: keywords }), // map your “keywords” into the MCP’s “preferences”
    });

    if (!tripRes.ok) {
      console.error('Itinerary fetch failed:', await tripRes.text());
      return NextResponse.json(
        { error: 'Failed to fetch itinerary' },
        { status: 502 }
      );
    }
    const { itinerary, error: mcpError } = await tripRes.json();
    if (mcpError) {
      console.error('MCP service error:', mcpError);
      return NextResponse.json(
        { error: 'Itinerary generation error' },
        { status: 502 }
      );
    }

    // 3️⃣ Generate the podcast script from the itinerary
    const scriptResp = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a professional podcast scriptwriter who creates engaging conversations between two hosts: Alex (curious) and Sam (knowledgeable).`,
        },
        {
          role: 'user',
          content: `Here’s a travel itinerary:\n\n${itinerary}\n\nWrite a natural, conversational 3–5 minute podcast script (Alex & Sam) that walks through this trip.`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });
    const script = scriptResp.choices[0]?.message?.content || '';

    // 4️⃣ Turn that script into audio (and video + optional YouTube upload)
    let audioUrl: string | null = null;
    let videoUrl: string | null = null;
    let youtubeUrl: string | null = null;
    let videoId: string | null = null;

    try {
      // 4a. Text‐to‐speech
      let ttsInput = script;
      if (script.length > 4000) {
        console.log(`⚠️ Script too long (${script.length} chars), truncating for TTS`);
        ttsInput = script.slice(0, 3950) + '...';
      }
      const ttsResp = await openai.audio.speech.create({
        model: 'tts-1',
        voice: 'alloy',
        input: ttsInput,
        response_format: 'mp3',
      });
      const audioBuffer = Buffer.from(await ttsResp.arrayBuffer());

      // 4b. Package it into a video
      try {
        const imageUrl =
          `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dog.webp`;
        const imageBuffer = await fetchImageBuffer(imageUrl);
        const videoBuffer = await createVideoBuffer(audioBuffer, imageBuffer);
        videoUrl = `data:video/mp4;base64,${videoBuffer.toString('base64')}`;

        // 4c. (Optional) upload to YouTube
        try {
          if (isYouTubeConfigured()) {
            const user = await currentUser();
            const username =
              user?.username ?? user?.firstName ?? user?.lastName ?? 'AI User';
            const title = `AI Podcast: ${keywords}`;
            const description = `Here’s the travel itinerary:\n\n${itinerary}`;

            const ytResult = await uploadToYouTube(
              videoBuffer,
              title,
              description,
              [],      // you can derive tags from `keywords` if you like
              username
            );
            youtubeUrl = ytResult.youtubeUrl;
            videoId = ytResult.videoId;
          }
        } catch (ytErr) {
          console.warn('⚠️ YouTube upload failed:', ytErr);
        }
      } catch (vidErr) {
        console.error('❌ Error creating video:', vidErr);
      }

      // 4d. Always include the audio URL
      audioUrl = `data:audio/mp3;base64,${audioBuffer.toString('base64')}`;
    } catch (ttsErr) {
      console.error('❌ TTS error:', ttsErr);
    }

    // 5️⃣ Return everything
    return NextResponse.json({
      success: true,
      data: {
        keywords,
        itinerary,
        script,
        audioUrl,
        videoUrl,
        youtubeUrl,
        videoId,
        userId,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Podcast generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate podcast' },
      { status: 500 }
    );
  }
}
