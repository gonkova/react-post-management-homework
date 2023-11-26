import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../constants/Constants';

export default function PostMаnagement() {
    const [posts, setPosts] = useState([]);
    const DEFAULT_POST = { id: null, title: '', content: '', author: '' };
    const [post, setPost] = useState(DEFAULT_POST);
    const [view, setView] = useState('list');

    useEffect(() => {
        loadPosts();
    }, []);

    function loadPosts() {
        axios.get(`${API_URL}/posts`)
            .then(response => {
                console.log(response.data);
                setPosts(response.data);
            })
    }

    function submitForm() {
        const url = post.id == null ? `${API_URL}/posts` : `${API_URL}/posts/${post.id}`;
        const axiosMethod = post.id == null ? axios.post : axios.put;
        axiosMethod(url, post)
            .then(response => {
                loadPosts();
                setView('list');
            })
            .catch(error => {
                console.error('Error during POST request:', error);
            });
    }

    function deletePost(id) {
        axios.delete(`${API_URL}/posts/${id}`)
            .then(response => {
                console.log(`Successfully deleted post with ID: ${id}`);
                loadPosts();
            })
            .catch(error => {
                console.error(`Error deleting post with ID: ${id}. Error details:`, error);
                alert('В момента имаме проблем, опитайте по-късно отново.')
            })
    }

    function handleInput(event) {
        const { name, value } = event.target;
        setPost({ ...post, [name]: value });
    }

    function edit(p) {
        setPost(p);
        setView('form');
    }

    function create(post) {
        setView('form');
        setPost(DEFAULT_POST);
    }

    function postForm() {
        return (
            <div className='container  mt-3'>
                <div className='row'>
                    <div className='col-12  col-sm-12'>
                        <h5 className='text-primary mb-3'>{post.id === null ? 'Форма за добавяне на статия' : 'Форма за реактиране на статия'}</h5>
                        <input
                            type='text'
                            name='title'
                            placeholder='Заглавие на статията'
                            className='form-control mb-3'
                            onInput={e => handleInput(e)}
                            value={post.title}
                        />
                        <textarea
                            name='content'
                            placeholder="Съдържание"
                            className='form-control mb-3'
                            onChange={e => handleInput(e)}
                            value={post.content}
                        />
                        <input
                            type='text'
                            name='author'
                            placeholder='Автор'
                            className='form-control mb-3'
                            onInput={e => handleInput(e)}
                            value={post.author}
                        />
                        <button className='btn btn-primary text-white mb-3'
                            onClick={() => submitForm()}
                        >
                            {post.id == null ? 'Добави' : 'Обнови'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    function showList() {
        return (
            <div className='container mt-3'>
                <div className='row'>
                    <div className='col-12  col-sm-12'>
                        <button className='btn btn-success mb-3' onClick={() => create()}>Добави статия</button>
                        <div className='table-responsive'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>ИД</th>
                                        <th>Заглавие на статията</th>
                                        <th>Съдържание</th>
                                        <th>Автор</th>
                                        <th>Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {posts.map(p => (
                                        <tr key={p.id}>
                                            <td>{p.id}</td>
                                            <td>{p.title}</td>
                                            <td>{p.content}</td>
                                            <td>{p.author}</td>
                                            <td>
                                                <button className='btn btn-warning text-white me-3'
                                                    onClick={() => edit(p)}
                                                >
                                                    <i className='fa fa-pencil'></i>
                                                </button>
                                                <button className='btn btn-danger text-white'
                                                    onClick={() => deletePost(p.id)}
                                                >
                                                    <i className='fa fa-times'></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {view == 'list' ? showList() : postForm()}
        </>
    );
}
