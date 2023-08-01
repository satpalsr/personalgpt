export const runtime = 'edge'

export async function POST(req: Request) {

    const { searchQuery } = await req.json()
    // console.log(`searchQuery ${searchQuery}`)

    const apiKey = process.env.YOUTUBE_API_KEY;
    const maxResults = 3;
    // const regionCode = 'GB';

    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video&q=${encodeURIComponent(
        searchQuery
        )}&maxResults=${maxResults}`
    );

    // &regionCode=${regionCode}
    
    const data = await response.json();
    
    let videos = data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.default.url
    })); 

    const response2 = await fetch('https://www.personalgpt.dev:8000/api/youtubetranscript',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "videos": videos,
            }),
        }
    );

    // const res2 = await response2.json();
    // const videoText = await res2.body

    const Res2 = await response2.json();
    const body = JSON.parse(Res2.body); // Decode the "body" property
    videos = body.videos


    // Add videoText to videos
    // videos = videos.map((video: any) => ({
    //     ...video,
    //     videoText: videoText,
    // }));

    // console.log(`videos in youtube ${JSON.stringify(videos)}`)

    // const videoText = 'The name is John.';

    return new Response(JSON.stringify(videos), {
        headers: { 'content-type': 'text/plain;charset=UTF-8' },
    });

    // return new Response(JSON.stringify(videos), {
    //     headers: { 'content-type': 'application/json;charset=UTF-8' },
    // });
}