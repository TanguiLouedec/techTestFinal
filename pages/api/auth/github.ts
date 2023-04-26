import { NextApiRequest, NextApiResponse } from "next";

const CLIENT_ID = '823088350817b5fcb472'
const CLIENT_SECRET = '15b9d63357f14fc7547c9b42994f5508811405dd'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { code } = req.query

    const response = await fetch(
        `https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
        }
    )

    const data = await response.json();

    res.redirect(`/profile?access_token=${data.access_token}`)
}