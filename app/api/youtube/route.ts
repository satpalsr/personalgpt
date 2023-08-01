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

    console.log(`videos ${JSON.stringify(videos)}`)

    const response2 = await fetch(process.env.YOUTUBE_TRANSCRIPT_ENDPOINT!,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"videos": videos}) 
        }
    );

    const Res2 = await response2.json();
    videos = Res2['videos']


    return new Response(JSON.stringify(videos), {
        headers: { 'content-type': 'text/plain;charset=UTF-8' },
    });
}