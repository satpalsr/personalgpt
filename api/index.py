import json

from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import parse_qs, urlparse

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


ALLOWED_SCHEMAS = {"http", "https"}
ALLOWED_NETLOCK = {
    "youtu.be",
    "m.youtube.com",
    "youtube.com",
    "www.youtube.com",
    "www.youtube-nocookie.com",
    "vid.plus",
}

def _parse_video_id(url: str):
    """Parse a youtube url and return the video id if valid, otherwise None."""
    parsed_url = urlparse(url)

    if parsed_url.scheme not in ALLOWED_SCHEMAS:
        return None

    if parsed_url.netloc not in ALLOWED_NETLOCK:
        return None

    path = parsed_url.path

    if path.endswith("/watch"):
        query = parsed_url.query
        parsed_query = parse_qs(query)
        if "v" in parsed_query:
            ids = parsed_query["v"]
            video_id = ids if isinstance(ids, str) else ids[0]
        else:
            return None
    else:
        path = parsed_url.path.lstrip("/")
        video_id = path.split("/")[-1]

    if len(video_id) != 11:  # Video IDs are 11 characters long
        return None

    return video_id
    
@app.post("/api/youtubetranscript")
async def get_video_text(request: Request):

    body = await request.json()
    videos = body.get("videos")

    for idx, video in enumerate(videos):
        # video_id = _parse_video_id(video_url)
        video_id = video["id"]

        transcript_list = None
        language = None

        try:
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        except Exception as e:
            continue

            # return {
            #     'statusCode': 400,
            #     'body': "No transcript found"
            # }
        
        for transcript_lang in transcript_list:
            if "en" == transcript_lang.language_code :
                language = "en"
                break
        
        if language is None:
            for transcript_lang in transcript_list:
                if "en-IN" == transcript_lang.language_code :
                    language = "en-IN"
                    break

        if language is None:
            continue
        

        transcript = transcript_list.find_transcript([language])
        transcript_pieces = transcript.fetch()
        transcript = ' '.join([t["text"].strip(" ") for t in transcript_pieces])

        videos[idx]["transcript"] = transcript

    return {
        'statusCode': 200,
        'body': json.dumps({
            "videos": videos,
        })
    }
