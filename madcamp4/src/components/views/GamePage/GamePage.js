import React, { useEffect, useState } from 'react'
import Axios from 'axios';

function GamePage() {
    // const [Posts, setPosts] = useState([])
    // const [Semester, setSemester] = useState("2021S")
    // const [userList, setuserList] = useState([]);

    // const variable = {
    //     semester: Semester
    // }

    // useEffect(() => {
    //     Axios.post('/api/posts/getPosts', variable)
    //         .then(response => {
    //             console.log("getPosts");
    //             if (response.data.success) {
    //                 setPosts(response.data.posts)
    //             } else {
    //                 alert('Failed to fectch product datas')
    //             }
    //         })

    //     Axios.post('/api/users/semester', variable)
    //         .then(response => {
    //             console.log("/users/semester");
    //             if (response.data.success) {
    //                 setuserList(response.data.users)
    //             } else {
    //                 alert('Failed to fectch product datas')
    //             }
    //         })

    // }, [Semester])

    // const updateSemester = (selectSemester) => {
    //     setSemester(selectSemester)
    //     console.log("updateSemester");
    // }


    
    return (
        <div>
            Hello
        </div>
    )
}

export default GamePage