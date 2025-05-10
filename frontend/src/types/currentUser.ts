export interface UserType {
    _id: string;
    username: string;
    publicId: string;
    email: string;
    gender: "male" | "female" | "other";
    age: number;
    profilePic: string;
    likes: number;
    followers: string[];
    followed: string[];
    totalComments: number;
    bookmarked: string[];
    createdAt: string;
    updatedAt: string;
  };