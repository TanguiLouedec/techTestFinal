import { NextApiRequest, NextApiResponse } from "next";

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

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