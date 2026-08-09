import { useEffect, useState } from 'react';
import { Star, GitFork, ExternalLink, Users, BookOpen } from 'lucide-react';
import { GithubIcon } from '../components/SocialIcons';
import { personalInfo } from '../data/portfolio';

const USERNAME = 'akashkasture';
const CACHE_KEY = `ak-os-github-cache-${USERNAME}`;
const CACHE_TTL_MS = 5 * 60 * 1000;

function loadCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, fetchedAt: Date.now() }));
  } catch { /* ignore */ }
}

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Java: '#b07219', Python: '#3572A5',
  HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051',
};

export default function GitHubApp() {
  const [state, setState] = useState(() => {
    const cached = loadCache();
    return cached
      ? { status: 'ready', profile: cached.profile, repos: cached.repos }
      : { status: 'loading', profile: null, repos: [] };
  });

  useEffect(() => {
    if (state.status !== 'loading') return;

    let cancelled = false;
    (async () => {
      try {
        const [profileRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${USERNAME}`),
          fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=6`),
        ]);

        if (profileRes.status === 403 || reposRes.status === 403) {
          if (!cancelled) setState({ status: 'rate-limited', profile: null, repos: [] });
          return;
        }
        if (!profileRes.ok || !reposRes.ok) {
          if (!cancelled) setState({ status: 'error', profile: null, repos: [] });
          return;
        }

        const profile = await profileRes.json();
        const repos = await reposRes.json();
        if (cancelled) return;
        saveCache({ profile, repos });
        setState({ status: 'ready', profile, repos });
      } catch {
        if (!cancelled) setState({ status: 'error', profile: null, repos: [] });
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run once on mount; state.status is only read to skip a redundant fetch when hydrated from cache
  }, []);

  if (state.status === 'loading') {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="w-6 h-6 rounded-full border-2 border-white/15 border-t-indigo-400 animate-spin" />
      </div>
    );
  }

  if (state.status === 'error' || state.status === 'rate-limited') {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full text-center gap-3">
        <GithubIcon size={28} style={{ color: 'var(--text-3)' }} />
        <p className="text-sm" style={{ color: 'var(--text-2)' }}>
          {state.status === 'rate-limited'
            ? "GitHub's API rate limit was hit for this browser — try again in a bit."
            : "Couldn't reach GitHub's API right now."}
        </p>
        <a
          href={personalInfo.github}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View profile directly <ExternalLink size={12} />
        </a>
      </div>
    );
  }

  const { profile, repos } = state;

  return (
    <div className="@container p-6 sm:p-8">
      {/* Profile header */}
      <div className="flex items-start gap-4 mb-8">
        <img
          src={profile.avatar_url}
          alt={profile.login}
          className="w-16 h-16 rounded-2xl"
          style={{ border: '1px solid var(--surface-border)' }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-1)' }}>{profile.name || profile.login}</h2>
            <a
              href={profile.html_url} target="_blank" rel="noopener noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              @{profile.login} <ExternalLink size={11} />
            </a>
          </div>
          {profile.bio && <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>{profile.bio}</p>}
          <div className="flex items-center gap-4 mt-3 text-xs font-mono" style={{ color: 'var(--text-4)' }}>
            <span className="flex items-center gap-1"><BookOpen size={12} /> {profile.public_repos} repos</span>
            <span className="flex items-center gap-1"><Users size={12} /> {profile.followers} followers</span>
          </div>
        </div>
      </div>

      {/* Repos */}
      <h3 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-4)' }}>Recent Repositories</h3>
      {repos.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-4)' }}>No public repositories yet.</p>
      ) : (
        <div className="grid @md:grid-cols-2 gap-3">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank" rel="noopener noreferrer"
              className="block p-4 rounded-xl transition-colors hover:border-indigo-500/30"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--surface-border)' }}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-sm font-semibold truncate" style={{ color: 'var(--text-1)' }}>{repo.name}</span>
                <ExternalLink size={12} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--text-4)' }} />
              </div>
              {repo.description && (
                <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-3)' }}>{repo.description}</p>
              )}
              <div className="flex items-center gap-3 text-[11px] font-mono" style={{ color: 'var(--text-4)' }}>
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: LANG_COLORS[repo.language] || '#8b8b8b' }} />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1"><Star size={11} /> {repo.stargazers_count}</span>
                <span className="flex items-center gap-1"><GitFork size={11} /> {repo.forks_count}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
