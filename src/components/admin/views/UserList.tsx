import {
    Avatar,
    Link as MuiLink,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Link from "next/link";
import React from "react";
import { hasPermission, User, userRoleLabels } from "../../../interfaces";
import { useAuth } from "../../../lib/auth";
import { parseUserRole } from "../../../utils/parsers";

interface Props {
    users: User[];
    updateUser?: (user: User) => any;
}

const useStyles = makeStyles((theme: Theme) => ({
    tableContainer: {
        marginTop: theme.spacing(4)
    },
    table: {
        minWidth: theme.breakpoints.width("sm")
    },
    identification: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row"
    },
    avatar: {
        marginRight: theme.spacing(2)
    }
}));

const UserList: React.FC<Props> = ({ users, updateUser }: Props) => {
    const classes = useStyles();
    const auth = useAuth();

    return (
        <TableContainer component={Paper} className={classes.tableContainer}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Username</TableCell>
                        <TableCell align="right">Account Provider</TableCell>
                        <TableCell align="right">Email</TableCell>
                        <TableCell align="right">Role</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map(user => (
                        <TableRow hover key={user.id}>
                            <TableCell component="th" scope="row" align="center">
                                <div className={classes.identification}>
                                    <Avatar className={classes.avatar} src={user.avatarURL} />
                                    <Link
                                        href="/admin/users/[id]"
                                        as={`/admin/users/${user.id}`}
                                        passHref
                                    >
                                        <MuiLink component="a" color="inherit" variant="body2">
                                            <Typography>{user.username}</Typography>
                                        </MuiLink>
                                    </Link>
                                </div>
                            </TableCell>
                            <TableCell align="right">{user.provider}</TableCell>
                            <TableCell align="right">{user.email}</TableCell>
                            <TableCell align="right">
                                <TextField
                                    select
                                    value={user.role}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                        updateUser &&
                                        updateUser({
                                            ...user,
                                            role: parseUserRole(event.target.value)
                                        })
                                    }
                                    disabled={!auth.user || !hasPermission(auth.user, "manage")}
                                    variant="standard"
                                >
                                    {Object.entries(userRoleLabels).map(([value, label]) => (
                                        <MenuItem key={value} value={value}>
                                            {label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserList;
