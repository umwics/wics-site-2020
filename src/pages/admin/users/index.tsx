import { Container, makeStyles, Theme, Typography } from "@material-ui/core";
import { GetStaticProps, NextPage } from "next";
import { useSnackbar } from "notistack";
import UserList from "../../../components/admin/views/UserList";
import AdminLayout from "../../../components/layouts/AdminLayout";
import { hasPermission, User } from "../../../interfaces";
import { AuthContextInstance, withAuth } from "../../../lib/auth";
import { getAllUsers, useUsers } from "../../../lib/db";

interface Props {
    users: User[];
    auth: AuthContextInstance;
}

const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }
}));

const Users: NextPage<Props> = ({ users, auth }: Props) => {
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();

    const { data: revalidatedUsers } = useUsers({ initialData: users });

    const updateUser = async (user: User) => {
        const response = await fetch(`/api/${process.env.apiVersion}/users/${user.id}`, {
            method: "PATCH",
            headers: {
                token: (await auth.getUserToken()) as string
            },
            body: JSON.stringify({ ...user })
        });

        if (response.ok) {
            enqueueSnackbar("Successfully Updated User", { variant: "success" });
        } else enqueueSnackbar("Failed to Update User", { variant: "error" });
    };

    return (
        <AdminLayout title="Users">
            <Container component="main" maxWidth="md">
                <div className={classes.paper}>
                    <Typography component="h1" variant="h3">
                        Users List
                    </Typography>
                    <UserList users={revalidatedUsers} updateUser={updateUser} />
                </div>
            </Container>
        </AdminLayout>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const users: User[] = await getAllUsers();
    return { props: { users }, revalidate: 60 };
};

export default withAuth(Users, {
    allowedAccess: (user: User | null) => !!user && hasPermission(user, "read")
});
