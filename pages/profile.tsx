import { GetServerSideProps } from "next";

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
    return (
        <div className={"flex flex-col items-center"}>
            <div className={"bg-gray-700 flex flex-col items-center w-2/12 gap-2 p-4 rounded-xl shadow-lg"}>
                <img src={user.avatar_url} alt="avatar" className={"h-48 aspect-square rounded-full"}/>
                <h1 className={"text-lg"}>{user.name}</h1>
                <h1 className={"text-gray-400"}>{user.login}</h1>
                <p className={"text-gray-400"}>{user.email}</p>
                <p className={"text-gray-400"}>{user.bio}</p>
            </div>
            <ul>
                {repositories && repositories.length > 0 ? (
                    <div>
                        <h2>Your Repositories</h2>
                        <ul>
                            {repositories.map((repo) => (
                                <li key={repo.full_name}>
                                    <p>{repo.full_name}</p>
                                    <p>Stars: {repo.stargazers_count}</p>
                                    <p>Watchers: {repo.watchers_count}</p>
                                    <p>Open Issues: {repo.open_issues_count}</p>
                                    <p>Languages:</p>
                                    <ul>
                                        {Object.entries(repo.languages).map(([name, percentage]) => (
                                            <li key={name}>
                                                {name}: {percentage}%
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>You have no repositories.</p>
                )}
            </ul>
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




