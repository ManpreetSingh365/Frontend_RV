"use server";
import { revalidatePath } from "next/cache";
import {
    createUser,
    updateUser,
    deleteUser
} from "../service/user.service";
import { User } from "../service/user.service";
import { CreateUserInput, UpdateUserInput } from "../validation/user.schema";

/* ================= USER ACTIONS ================= */

// CREATE
export async function createUserAction(formData: CreateUserInput) {
    // const payload = {
    //     username: formData.username,
    //     firstName: formData.firstName,
    //     lastName: formData.lastName,
    //     password: formData.password,
    //     email: formData.email,
    //     phoneNumber: formData.phoneNumber,
    //     roleId: formData.roleId,
    // };

    await createUser(formData);
    revalidatePath("/users");
}

// UPDATE
export async function updateUserAction(userId: string, formData: UpdateUserInput) {
    // const payload = {
    //     firstName: formData.firstName,
    //     lastName: formData.lastName,
    //     email: formData.email,
    //     phoneNumber: formData.phoneNumber,
    //     roleId: formData.roleId,
    // };

    await updateUser(userId, formData);
    revalidatePath(`/users/${userId}`);
}

// DELETE - Client action (runs in browser, cookies included automatically)
export async function deleteUserAction(userId: string): Promise<void> {
    await deleteUser(userId);
    revalidatePath("/users");
}


// "use client";

// import { deleteUser } from "../service/user.service";

// export async function deleteUserAction(userId: string): Promise<void> {
//   await deleteUser(userId);
// }
