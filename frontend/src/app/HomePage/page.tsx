import React from "react";
import LogoutButton from "../../pages/LogoutButton";
import AddTodo from "../../pages/AddTodo";

const HomePage = () => {
    return (
        <>
            <div className="flex justify-end px-10 pt-5">
                <LogoutButton />
            </div>
            <div>
                <AddTodo />
            </div>
        </>
    );
};

export default HomePage;
