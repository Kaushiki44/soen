import React from 'react'
import { UserContext } from '../context/user.context'
import { useContext, useState, useEffect} from 'react'
import axios from "../config/axios";
import {useNavigate} from 'react-router-dom';

const Home = () => {

    const {user} = useContext(UserContext)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [project, setProject] = useState([])

    const navigate = useNavigate();

    function createProject(e){
      e.preventDefault();
      console.log(projectName);

      axios.post('/projects/create', {
        name: projectName,
      })
      .then((res) => {
        console.log(res)
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.log(error)
      })

    }

    useEffect(() => {
      axios.get('/projects/all').then((res) => {
        setProject(res.data.projects)
      }).catch(err => {
        console.log(err)
      })
    }, [])

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 font-sans relative overflow-x-hidden">

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-indigo-700/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-[-8%] w-[350px] h-[350px] bg-purple-700/10 rounded-full blur-3xl" />
      </div>

      {/* Page content */}
      <div className="relative z-10 px-8 py-8 max-w-6xl mx-auto">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-100">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your coding projects</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

          {/* New Project card */}
          <button
            id="new-project-btn"
            onClick={() => setIsModalOpen(true)}
            className="group flex flex-col items-center justify-center gap-3 p-6 rounded-xl
                       border-2 border-dashed border-indigo-700/50 bg-indigo-950/20
                       hover:border-indigo-500 hover:bg-indigo-950/40
                       hover:shadow-lg hover:shadow-indigo-900/30
                       hover:scale-[1.02] active:scale-[0.98]
                       transition-all duration-200 min-h-[140px] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-900/60 border border-indigo-700/50 flex items-center justify-center group-hover:bg-indigo-800/60 group-hover:border-indigo-500 transition-all duration-200">
              <i className="ri-add-line text-indigo-400 text-xl group-hover:text-indigo-200 transition-colors"></i>
            </div>
            <span className="text-xs font-semibold text-indigo-400 group-hover:text-indigo-200 transition-colors tracking-wide">
              New Project
            </span>
          </button>

          {/* Project cards */}
          {project.map((proj) => (
            <div
              key={proj._id}
              onClick={() => navigate('/project', { state: { project: proj } })}
              className="group flex flex-col gap-4 p-5 rounded-xl cursor-pointer
                         bg-gray-900/80 border border-indigo-900/30
                         hover:border-indigo-600/50 hover:bg-gray-900
                         hover:shadow-xl hover:shadow-indigo-950/60
                         hover:scale-[1.02] active:scale-[0.99]
                         transition-all duration-200 min-h-[140px] relative overflow-hidden"
              style={{ boxShadow: '0 1px 0 0 rgba(99,102,241,0.08)' }}
            >
              {/* Card top accent */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-700/30 to-transparent group-hover:via-indigo-500/50 transition-all duration-300" />

              {/* Project icon + name */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-200">
                  <i className="ri-code-s-slash-fill text-white text-sm"></i>
                </div>
                <h2 className="font-semibold text-sm text-gray-200 group-hover:text-white transition-colors pt-0.5 leading-snug line-clamp-2">
                  {proj.name}
                </h2>
              </div>

              {/* Footer row */}
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 group-hover:text-gray-400 transition-colors">
                  <i className="ri-user-line text-xs"></i>
                  <span>{proj.users.length} {proj.users.length === 1 ? 'member' : 'members'}</span>
                </div>
                <i className="ri-arrow-right-line text-xs text-gray-700 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all duration-200"></i>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create project modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="relative bg-gray-900/90 border border-indigo-900/40 rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 overflow-hidden"
            style={{ boxShadow: '0 0 0 1px rgba(99,102,241,0.12), 0 25px 50px -12px rgba(79,70,229,0.2)' }}
          >
            {/* Top glow line */}
            <div className="absolute top-0 inset-x-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <i className="ri-folder-add-fill text-white text-sm"></i>
                </div>
                <h2 className="text-base font-semibold text-gray-100">New Project</h2>
              </div>
              <button
                id="close-create-modal-btn"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-950/30 transition-all duration-200"
              >
                <i className="ri-close-fill text-lg"></i>
              </button>
            </div>

            <form onSubmit={createProject} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 tracking-wider uppercase">
                  Project Name
                </label>
                <input
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName}
                  type="text"
                  required
                  placeholder="e.g. my-express-api"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-800/80 border border-gray-700/60 text-gray-100 text-sm placeholder-gray-600
                             focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  id="cancel-create-btn"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-gray-400 border border-gray-700/60 hover:border-gray-600 hover:text-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="confirm-create-btn"
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white
                             bg-gradient-to-r from-indigo-600 to-purple-600
                             hover:from-indigo-500 hover:to-purple-500
                             hover:shadow-md hover:shadow-indigo-900/40
                             active:scale-[0.98] transition-all duration-200"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default Home
