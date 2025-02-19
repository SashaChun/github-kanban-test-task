import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

type IssueType = {
    id: number;
    title: string;
    opened?: string | number;
    author: string;
    comments?: string;
    status?: string;
}

type RepoDataType = {
    fullName: string;
    stars: number;
    repoUrl: string;
}

interface GithubState {
    repoData: RepoDataType | null;
    issues: IssueType[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: GithubState = {
    repoData: null,
    issues: [],
    status: 'idle',
    error: null,
};

export const fetchRepoData = createAsyncThunk(
    'github/fetchRepoData',
    async (link: string) => {
        const repoPath = link.replace("https://github.com/", "");

        try {
            const response = await axios.get(`https://api.github.com/repos/${repoPath}/issues`);
            const repoResponse = await axios.get(`https://api.github.com/repos/${repoPath}`);

            const repoData: RepoDataType = {
                fullName: repoResponse.data.full_name,
                stars: repoResponse.data.stargazers_count,
                repoUrl: repoResponse.data.html_url,  // Отримуємо посилання на репозиторій
            };

            const issuesData: IssueType[] = response.data.map((issue: any) => ({
                id: issue.id,
                title: issue.title,
                opened: new Date(issue.created_at).toLocaleDateString(),
                author: issue.user.login,
                comments: issue.comments,
                status: !issue.assignee ? "To Do" : issue.state === "open" ? "In Progress" : "Done",
            }));

            return { repoData, issuesData };
        } catch (error) {
            throw new Error('Error loading data from GitHub');
        }
    }
);

const githubSlice = createSlice({
    name: 'github',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRepoData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRepoData.fulfilled, (state, action: PayloadAction<{ repoData: RepoDataType, issuesData: IssueType[] }>) => {
                state.status = 'succeeded';
                state.repoData = action.payload.repoData;
                state.issues = action.payload.issuesData;
            })
            .addCase(fetchRepoData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Unknown error';
            });
    },
});

export default githubSlice.reducer;
