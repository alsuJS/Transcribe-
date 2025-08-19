"use client"

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      sentences,
      startTime,
      endTime,
      profileId,
      accuracy,
      audio,
    } = body;

    const reading = await prisma.reading.create({
      data: {
        sentences,
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
        profileId,
        accuracy,
        audio,
      },
    });

    return NextResponse.json({ success: true, reading });
  } catch (error) {
    console.error('POST /api/readings error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
