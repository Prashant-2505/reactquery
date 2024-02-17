import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { fetchPosts, addPost, fetchTags } from '../api/api'

const PostList = () => {

    const { data: postData, isLoading, isError, error, status } = useQuery({
        queryKey: ["posts"],
        queryFn: fetchPosts,
        // gcTime:0
    });

    const { data: tagData } = useQuery({
        queryKey: ["tags"],
        queryFn: fetchTags,
        staleTime: Infinity

    });


    const queryClient = useQueryClient()

    const { mutate, isError: isPostError, isPending, error: postError, reset } = useMutation({
        mutationFn: addPost,
        onMutate: () => {
            return { id: 1 }
        },
        onSuccess: (data, variable, context) => {
            console.log(data, variable, context)
            queryClient.invalidateQueries({
                queryKey: ["posts"],
                exact: true,
            })
        },
        // onError:(error,variable,context) = {},
        // onSettled: (data, variable, context,error) => {}
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const title = formData.get('title');

        const tags = Array.from(formData.entries())
            .filter(([key, value]) => value === 'on')
            .map(([key]) => key);

        if (!title || !tags) return

        mutate({ id: postData.length + 1, title, tags })
        e.target.reset
    };


    return (
        <div className='container'>
            <form onSubmit={handleSubmit}>
                <input type="text"
                    placeholder='Enter your post'
                    className='postBox'
                    name='title'

                />
                <div className='tags'>
                    {tagData?.map((tag) => (
                        <div key={tag}>
                            <input
                                type="checkbox"
                                id={tag}
                                name={tag}
                            />
                            <label htmlFor={tag}>{tag}</label>
                        </div>
                    ))}
                </div>
                <button>Post</button>
            </form>
            {isLoading && isPending && <p>Loading ....</p>}
            {isError && <p>{error.message}</p>}
            {isPostError && <p onClick={() => reset()}>Unable to post</p>}

            {postData && postData.map((post) => (
                <div key={post.id} className='post'>
                    <div>{post.title}</div>
                    {post.tags.map((tag, index) => (
                        <span key={index}>{tag}, </span>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default PostList
