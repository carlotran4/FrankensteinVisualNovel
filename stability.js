export const textToImage = async (prompt) => {
    console.log("beginning image generation...")
    const path =
        "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";

    const headers = {
        Accept: "application/json",
        "content-type": "application/json",
        Authorization: process.env.STABLE_DIFFUSION_KEY
    };

    const body = {
        steps: 25,
        height:768,
        width:1344,
        seed: 0,
        cfg_scale: 5,
        samples: 1,
        text_prompts: [
        {
            "text": prompt
        }],
    };

    const response = await fetch(
        path,
        {
        headers,
        method: "POST",
        body: JSON.stringify(body),
        }
    );
    
    if (!response.ok) {
        throw new Error(`Non-200 response: ${await response.text()}`)
    }
    
    const responseJSON = await response.json();

    var image = responseJSON.artifacts[0];
    
    return image.base64;

};