import { linkedinProfile, rawLinkedInPosts, type LinkedInPost } from "@/data/linkedin-import";

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

export function normalizeLinkedInPosts() {
  return {
    posts: rawLinkedInPosts,
  } satisfies NormalizedLinkedInActivity;
}
