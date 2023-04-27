import { GetServerSideProps } from "next";
import Head from "next/head";
import {useRouter} from "next/router";
import {useEffect} from "react";

type User = {
    name: string
    login: string
    avatar_url: string
    email: string
    bio: string
}

type Repository = {
    full_name: string
    stargazers_count: number
    watchers_count: number
    open_issues_count: number
    languages_url: string
    html_url: string
    languages: Language
}

type Language = {
    [key: string]: number
}

type Props = {
    user: User
    repositories: Repository[]
}
export default function Profile({ user, repositories }: Props) {
    const router = useRouter()

    useEffect(() => {
        // Always do navigations after the first render
        router.push('/profile', undefined, { shallow: true })
    }, [])

    useEffect(() => {
        // The counter changed!
    }, [router.query.counter])
    return (
        <div className={"flex flex-col items-center gap-10"}>
            <Head>
                <title>Profile</title>
            </Head>
            <div className={"bg-gray-700 flex flex-col items-center w-2/12 gap-2 p-4 border-2 border-pink-700 rounded-xl shadow-lg"}>
                <img src={user.avatar_url} alt="avatar" className={"h-48 aspect-square rounded-full"}/>
                <h1 className={"text-lg"}>{user.name}</h1>
                <h1 className={"text-gray-400"}>{user.login}</h1>
                <p className={"text-gray-400"}>{user.email}</p>
                <p className={"text-gray-400"}>{user.bio}</p>
            </div>
            <div className={'w-3/5'}>
                {repositories && repositories.length > 0 ? (
                    <div className={'w-full'}>
                        <ul className={'flex flex-col gap-8 w-full'}>
                            {repositories.map((repo) => (
                                <li key={repo.full_name} className={'bg-gray-700 flex flex-col w-full rounded-md p-8 justify-evenly gap-4 shadow-lg'}>
                                    <a href={repo.html_url} className={'w-full text-center text-lg hover:text-pink-700'} target={'_blank'}>{repo.full_name}</a>
                                    <hr className="border-1 border-gray-600"/>
                                    <div className={'flex flex-row justify-evenly text-gray-400'}>
                                        <p className={'flex flex-row gap-2'}>
                                            <svg aria-hidden="true" className="w-5 h-full text-pink-700" fill="currentColor"
                                                 viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Rating
                                                star</title>
                                                <path
                                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                            </svg>
                                            {repo.stargazers_count}
                                        </p>
                                        <p className={'flex flex-row gap-2'}>
                                            <svg className="w-5 h-full text-pink-700" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12.015 7c4.751 0 8.063 3.012 9.504 4.636-1.401 1.837-4.713 5.364-9.504 5.364-4.42 0-7.93-3.536-9.478-5.407 1.493-1.647 4.817-4.593 9.478-4.593zm0-2c-7.569 0-12.015 6.551-12.015 6.551s4.835 7.449 12.015 7.449c7.733 0 11.985-7.449 11.985-7.449s-4.291-6.551-11.985-6.551zm-.015 3c-2.209 0-4 1.792-4 4 0 2.209 1.791 4 4 4s4-1.791 4-4c0-2.208-1.791-4-4-4z"/>
                                            </svg>
                                            {repo.watchers_count}
                                        </p>
                                        <p className={'flex flex-row gap-2'}>
                                            <svg className="w-5 h-full text-pink-700" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1 6h2v8h-2v-8zm1 12.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"/>
                                            </svg>
                                            {repo.open_issues_count}
                                        </p>
                                    </div>
                                    <hr className="border-1 border-gray-600"/>
                                    <div className={'flex flex-row items-center'}>
                                        <ul className={'w-full flex flex-col gap-4'}>
                                            {Object.entries(repo.languages).map(([name, percentage]) => (
                                                <div className={'w-full flex flex-row bg-gray-800 rounded-full overflow-clip'}><div style={{ width: `${percentage}%` }} className={'bg-pink-700 h-5 flex flex-row justify-start items-center pl-2 rounded-full'}><p className={'text-xs absolute'}>{name} ({percentage})%</p></div></div>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>You have no repositories.</p>
                )}
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
    context
) => {
    const { access_token } = context.query;

    const userResponse = await fetch('https://api.github.com/user', {
        headers: {
            Authorization: `token ${access_token}`,
        },
    });

    if (!userResponse.ok) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const user = await userResponse.json();

    const repositoriesResponse = await fetch('https://api.github.com/user/repos', {
        headers: {
            Authorization: `token ${access_token}`,
        },
    });

    if (!repositoriesResponse.ok) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const repositories: Repository[] = await repositoriesResponse.json();

    // Fetch languages for each repository
    const promises = repositories.map((repo) =>
        fetch(repo.languages_url, {
            headers: {
                Authorization: `token ${access_token}`,
            },
        })
    );

    const languageResponses = await Promise.all(promises);

    const languages: Language[] = await Promise.all(
        languageResponses.map((response) => response.json())
    );

    // Calculate language percentages for each repository
    const repositoriesWithLanguages = repositories.map((repo, index) => {
        const languageData = languages[index];

        const totalSize = Object.values(languageData).reduce(
            (acc, size) => acc + size,
            0
        );

        const percentages: Language = {};

        Object.entries(languageData).forEach(([name, size]) => {
            percentages[name] = Number(((size / totalSize) * 100).toFixed(2));
        });

        return {
            ...repo,
            languages: percentages,
        };
    });

    return {
        props: {
            user,
            repositories: repositoriesWithLanguages,
        },
    };
};




