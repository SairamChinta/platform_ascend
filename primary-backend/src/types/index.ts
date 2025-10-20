import { z } from "zod"


export const SignupSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    name: z.string().min(4, { message: "Name must be at least 4 characters" }),
})

export const SigninSchema = z.object({
    email: z.string(),
    password: z.string()
})

export const CeedCreateSchema = z.object({
    availableTriggerId : z.string(),
    triggerMetadata : z.any().optional(),
    actions: z.array(z.object({
        availableActionId: z.string(),
        actionMetadata: z.any().optional()
    }))
})