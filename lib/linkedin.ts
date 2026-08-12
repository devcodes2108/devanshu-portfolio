import { linkedinProfile, getFilteredLinkedInPosts, getLinkedInDebugInfo, type LinkedInPost } from "@/data/linkedin-import";

export type NormalizedLinkedInProfile = {
  name: string;
  headline: string;
  about: string;
  profilePhoto: string | null;
  publicLinks: {
    linkedin: string;
    github: string;
  };
};

export type NormalizedLinkedInActivity = {
  posts: LinkedInPost[];
  debug?: {
    total: number;
    included: number;
    excluded: number;
    excludedItems: Array<{ id: string; title: string; reason: string }>;
  };
};

export function normalizeLinkedInProfile() {
  return {
    name: linkedinProfile.name,
    headline: linkedinProfile.headline,
    about: linkedinProfile.about,
    profilePhoto: linkedinProfile.profilePhoto,
    publicLinks: linkedinProfile.publicLinks,
  } satisfies NormalizedLinkedInProfile;
}

export function normalizeLinkedInPosts(includeDebug = false): NormalizedLinkedInActivity {
  const posts = getFilteredLinkedInPosts();
  const debug = includeDebug ? getLinkedInDebugInfo() : undefined;

  return {
    posts,
    debug,
  } satisfies NormalizedLinkedInActivity;
}
