import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBlogByIdAPI, updateBlogAPI } from '@/apis/blog'
import { toast } from 'sonner'
import Header from '@/components/layouts/Header'
import Footer from '@/components/layouts/Footer'

const CATEGORIES = ['Dogs', 'Cats']

const BlogEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
        thumbnail: null
    })

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await getBlogByIdAPI(id)
                if (res.data.success) {
                    const blog = res.data.data
                    setFormData({
                        title: blog.title,
                        content: blog.content,
                        category: blog.category,
                        thumbnail: null
                    })
                }
            } catch (error) {
                console.log(error)
                navigate('/blog')
            }
        }
        fetchBlog()
    }, [id, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const data = new FormData()
            data.append('title', formData.title)
            data.append('content', formData.content)
            data.append('category', formData.category)
            if (formData.thumbnail) {
                data.append('thumbnail', formData.thumbnail)
            }

            const res = await updateBlogAPI(id, data)
            if (res.data.success) {
                toast.success(res.data.message)
                navigate(`/blog`)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Header />
            <div className="max-w-4xl mx-auto py-8">
                <h1 className="text-3xl font-bold mb-8">Edit Blog</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full p-2 border rounded"
                        >
                            {CATEGORIES.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2">Thumbnail (Optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files[0] })}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Content</label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full p-2 border rounded min-h-[200px]"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Blog'}
                    </button>
                </form>
            </div>
            <Footer />
        </>
    )
}

export default BlogEdit 