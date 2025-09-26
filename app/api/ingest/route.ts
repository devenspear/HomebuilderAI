import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest){
  const body = await req.json()
  const urls: string[] = body.urls ?? []
  return NextResponse.json({ urlCount: urls.length, entitiesDetected: ['Floorplan','Lot'] })
}
