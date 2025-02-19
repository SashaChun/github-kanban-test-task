import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRepoData } from "../redux/slices/githubSlice";
import { AppDispatch, RootState } from "../redux/store";

export default function Header() {
    const [link, setLink] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>();

    const { repoData } = useSelector((state: RootState) => state.github);

    useEffect(() => {
        if (repoData && Object.keys(repoData).length > 0) {
            localStorage.setItem('repoData', JSON.stringify(repoData));
        }
    }, [repoData]);


    const savedRepoData = JSON.parse(localStorage.getItem('repoData') || '{}');

    // Якщо немає даних у `repoData`, використовуємо `savedRepoData`
    const displayRepo = repoData && Object.keys(repoData).length > 0 ? repoData : savedRepoData;

    const handleFetch = () => {
        if (link) {
            dispatch(fetchRepoData(link));
        }
    };

    return (
        <header className="pt-2">
            <div className="flex px-2 space-x-2 items-center">
                <form
                    className="w-[100%] flex items-center"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleFetch();
                    }}
                >
                    <input
                        type="text"
                        className="flex-1 w-[100%] border border-black px-2"
                        placeholder="Enter repo URL"
                        onChange={(e) => setLink(e.target.value)}
                    />
                    <button type="submit" className="w-[150px] border border-black bg-white text-black">
                        Load issues
                    </button>
                </form>
            </div>

            {displayRepo?.fullName && (
                <div className="flex space-x-2 mt-5 px-2">
                    <a href={repoData?.repoUrl || savedRepoData.repoUrl}><p className="text-blue-600">{displayRepo.fullName || savedRepoData.fullName}</p></a>
                    <p className="flex items-center ml-5 text-black">
                    <span className="text-orange-500 mr-1">★</span>
                        {displayRepo.stars}
                    </p>
                </div>
            )}
        </header>
    );
}