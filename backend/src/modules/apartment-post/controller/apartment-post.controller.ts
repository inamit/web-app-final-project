import {ApartmentPost} from "../../../models/apartmentPost";
import {Comment} from "../../../models/comment"
import {
    fetchAllApartmentPosts,
    insertApartmentPost,
    removeApartmentPost as deleteApartmentPost,
    editApartmentPost,
    fetchApartmentPostByUser, insertCommentOnApartment, updateApartmentRating
} from "../repository/apartment-post.repository";
import {User} from "../../../models/user";
import {fetchUser} from "../../auth/repository/auth.repository";
import {RatingType} from "../../../models/rating";
import {fetchExisingRating, updateUserRatings} from "../../user/repository/user.repository";

export const fetchAllApartments = async (config?: { page: number, pageSize: number }): Promise<ApartmentPost[]> => {
    if (config) {
        checkPaginationConfigValid(config.page, config.pageSize);
    }

    return fetchAllApartmentPosts(config);
};

export const getApartmentsByUser = async (email: string): Promise<ApartmentPost[]> => {
    return fetchApartmentPostByUser(email);
};

export const insertApartment = async (apartment: ApartmentPost): Promise<void> => {
    checkIsApartmentValid(apartment)
    apartment.timestampInMilliseconds = Date.now();
    await insertApartmentPost(apartment);
};

export const commentOnApartment = async (comment: Comment): Promise<void> => {
    const authorUser: User | null = await fetchUser(comment.authorUsername);
    if (authorUser) {
        await insertCommentOnApartment(comment);
    } else {
        throw new Error('User not found');
    }
};

export const editApartment = async (apartmentPostId: string, apartment: ApartmentPost): Promise<void> => {
    checkIsApartmentValid(apartment);
    apartment.timestampInMilliseconds = Date.now();
    await editApartmentPost(apartmentPostId, apartment);
};

export const deleteApartment = async (apartmentPostId: string): Promise<void> => {
    if (apartmentPostId != "" && apartmentPostId != null) {
        await deleteApartmentPost(apartmentPostId);
    } else {
        throw new Error('apartment id is invalid');
    }
};

export const rateApartment = async (ratingType: RatingType, sightId: string, userEmail: string): Promise<void> => {
    if (!ratingType || !sightId || !userEmail) {
        throw new Error('Input parameter missing');
    }
    const existingRating: RatingType = await fetchExisingRating(userEmail, sightId);
    if (existingRating === RatingType.none) {
        await updateApartmentRating(sightId, ratingType, 1);
        await updateUserRatings(userEmail, sightId, ratingType, 'add');
    } else {
        await updateApartmentRating(sightId, existingRating, -1);
        await updateUserRatings(userEmail, sightId, existingRating, 'remove');
    }
}

const checkPaginationConfigValid = (page: number, pageSize: number): void => {
    if (!Number.isSafeInteger(page) || !Number.isSafeInteger(pageSize) || page < 0 || pageSize < 0) {
        throw new Error('Pagination config is invalid');
    }
}

const checkIsApartmentValid = (apartmentPost: ApartmentPost): void => {
    if (!apartmentPost || !apartmentPost.userName || !apartmentPost.title || !apartmentPost.imageUrl) {
        throw new Error('Apartment is missing required information');
    }
}