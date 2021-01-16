import * as Yup from "yup";
import {
    EventType,
    eventTypes,
    MemberPosition,
    memberPositions,
    MemberTerm,
    memberTerms,
    ResourceType,
    resourceTypes,
    UserRole,
    userRoles
} from "../interfaces";

export const loginSchema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().min(8).required()
});

export const registerSchema = Yup.object({
    username: Yup.string().min(1).required(),
    email: Yup.string().email().required(),
    password: Yup.string().min(8).required()
});

export const createUserSchema = Yup.object({
    username: Yup.string().min(1)
});

export const updateUserSchema = Yup.object({
    username: Yup.string().min(1),
    email: Yup.string().email(),
    provider: Yup.string(),
    avatarURL: Yup.string(),
    role: Yup.string().test("role", "Must be a valid role", role =>
        userRoles.includes(role as UserRole)
    )
});

export const addMemberSchema = Yup.object({
    name: Yup.string().required(),
    displayName: Yup.string(),
    title: Yup.string().required(),
    email: Yup.string().email(),
    description: Yup.string(),
    facts: Yup.array().of(Yup.string()),
    links: Yup.array().of(
        Yup.object().shape({
            title: Yup.string(),
            link: Yup.string().url()
        })
    ),
    positions: Yup.array().of(
        Yup.string().test("position", "Must be a valid position", position =>
            memberPositions.includes(position as MemberPosition)
        )
    ),
    terms: Yup.array().of(
        Yup.string().test("term", "Must be a valid term", term =>
            memberTerms.includes(term as MemberTerm)
        )
    ),
    rank: Yup.number().default(0),
    image: Yup.string()
});

export const updateMembersSchema = Yup.array().of(
    Yup.object({
        id: Yup.string().required(),
        name: Yup.string(),
        displayName: Yup.string(),
        title: Yup.string(),
        email: Yup.string().email(),
        description: Yup.string(),
        facts: Yup.array().of(Yup.string()),
        links: Yup.array().of(
            Yup.object().shape({
                title: Yup.string(),
                link: Yup.string().url()
            })
        ),
        positions: Yup.array().of(
            Yup.string().test("position", "Must be a valid position", position =>
                memberPositions.includes(position as MemberPosition)
            )
        ),
        terms: Yup.array().of(
            Yup.string().test("term", "Must be a valid position", term =>
                memberTerms.includes(term as MemberTerm)
            )
        ),
        rank: Yup.number().default(0),
        image: Yup.string()
    })
);

export const addCompanySchema = Yup.object({
    name: Yup.string().required(),
    displayName: Yup.string(),
    email: Yup.string().email(),
    description: Yup.string(),
    links: Yup.array().of(
        Yup.object().shape({
            title: Yup.string(),
            link: Yup.string().url()
        })
    ),
    members: Yup.array().of(
        Yup.object().shape({
            memberId: Yup.string().required(),
            term: Yup.string(),
            tools: Yup.array().of(Yup.string())
        })
    ),
    image: Yup.string()
});

export const addEventSchema = Yup.object({
    name: Yup.string().required(),
    title: Yup.string(),
    term: Yup.string(),
    type: Yup.string().test("type", "Must be a valid type", type =>
        eventTypes.includes(type as EventType)
    ),
    location: Yup.string(),
    description: Yup.string(),
    date: Yup.string(),
    photoCredits: Yup.array().of(Yup.string()),
    images: Yup.array().of(Yup.string())
});

export const addResourceSchema = Yup.object({
    name: Yup.string().required(),
    title: Yup.string(),
    description: Yup.string(),
    types: Yup.array().of(
        Yup.string().test("type", "Must be a valid type", type =>
            resourceTypes.includes(type as ResourceType)
        )
    ),
    link: Yup.string().url(),
    image: Yup.string()
});

export const addCarouselSchema = Yup.object({
    name: Yup.string().required(),
    autoplay: Yup.boolean(),
    indicators: Yup.boolean(),
    interval: Yup.number(),
    timeout: Yup.number(),
    startAt: Yup.number(),
    slides: Yup.array().of(
        Yup.object({
            title: Yup.string(),
            subtitle: Yup.string(),
            body: Yup.string(),
            linkName: Yup.string(),
            linkHref: Yup.string(),
            linkAs: Yup.string(),
            position: Yup.number().default(0),
            alt: Yup.string(),
            image: Yup.string()
        })
    )
});

export const addSocialLinkSchema = Yup.object({
    title: Yup.string(),
    subheader: Yup.string(),
    body: Yup.string(),
    linkName: Yup.string(),
    linkHref: Yup.string().required()
});

// written to satisfy weird Yup behavior https://github.com/jquense/yup/issues/670
export const validateStrictStrip = async <T>(schema: Yup.Schema<T>, value: T): Promise<T> => {
    const strict = await schema.validate(value, { strict: true, stripUnknown: false });
    return await schema.validate(strict, { strict: false, stripUnknown: true });
};
