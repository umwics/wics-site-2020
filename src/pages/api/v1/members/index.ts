import { NextApiRequest, NextApiResponse } from "next";
import { hasPermission, Member } from "../../../../interfaces";
import getHandler from "../../../../lib/apiHandler";
import { getAllMembers, getUser } from "../../../../lib/db";
import { createAuditLog, createMember, updateMembers } from "../../../../lib/dbAdmin";
import { UnauthorizedError } from "../../../../lib/errors";
import { auth } from "../../../../lib/firebaseAdmin";
import {
    addMemberSchema,
    updateMembersSchema,
    validateStrictStrip
} from "../../../../lib/validators";
import { getAsString } from "../../../../utils/queryParams";

const handler = getHandler()
    .get(async (_req: NextApiRequest, res: NextApiResponse) => {
        const members: Member[] = await getAllMembers();

        res.status(200).json({ members });
    })
    .post(async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            const token = getAsString(req.headers.token || "");

            const rawValues = <Member>JSON.parse(req.body);
            const newValues = await validateStrictStrip(addMemberSchema, rawValues);

            const decoded = await auth?.verifyIdToken(token);

            const executingUser = decoded?.uid ? await getUser(decoded.uid) : null;
            if (!executingUser || !hasPermission(executingUser, "write"))
                throw new UnauthorizedError("Invalid permissions");

            const newMember = await createMember({
                ...(newValues as Member)
            });
            if (newMember) {
                createAuditLog({
                    id: "",
                    executorId: executingUser.id,
                    action: "create",
                    collection: "members",
                    timestamp: new Date().toISOString()
                });
            }

            res.status(200).json(newMember);
        } catch (e) {
            throw new UnauthorizedError("Token invalid");
        }
    })
    .patch(async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            const token = getAsString(req.headers.token || "");

            const rawValues = <{ members: Member[] }>JSON.parse(req.body);
            const newValues = await validateStrictStrip(updateMembersSchema, rawValues.members);

            const decoded = await auth?.verifyIdToken(token);

            const executingUser = decoded?.uid ? await getUser(decoded.uid) : null;
            if (!executingUser || !hasPermission(executingUser, "manage"))
                throw new UnauthorizedError("Invalid permissions");

            const newMemberValues = await updateMembers(
                newValues as (Partial<Member> & { id: string })[]
            );

            res.status(200).json(newMemberValues);
        } catch (e) {
            throw new UnauthorizedError("Token invalid");
        }
    });

export default handler;
