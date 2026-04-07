import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../context/user.context'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket'
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js';
import { getWebContainer } from '../config/webcontainer'


function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)

            // hljs won't reprocess the element unless this attribute is removed
            ref.current.removeAttribute('data-highlighted')
        }
    }, [ props.className, props.children ])

    return <code {...props} ref={ref} />
}


const Project = () => {

    const location = useLocation()

    const [ isSidePanelOpen, setIsSidePanelOpen ] = useState(false)
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ selectedUserId, setSelectedUserId ] = useState(new Set()) // Initialized as Set
    const [ project, setProject ] = useState(location.state.project)
    const [ message, setMessage ] = useState('')
    const { user } = useContext(UserContext)
   const messageBox = useRef(null)

    const [ users, setUsers ] = useState([])
    const [ messages, setMessages ] = useState([]) // New state variable for messages
    const [ fileTree, setFileTree ] = useState({})

    const [ currentFile, setCurrentFile ] = useState(null)
    const [ openFiles, setOpenFiles ] = useState([])

    const [ webContainer, setWebContainer ] = useState(null)
    const webContainerRef = useRef(null)
    const [ iframeUrl, setIframeUrl ] = useState(null)

    const [ runProcess, setRunProcess ] = useState(null)

    const handleUserClick = (id) => {
        setSelectedUserId(prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId);
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            } else {
                newSelectedUserId.add(id);
            }

            return newSelectedUserId;
        });


    }


    function addCollaborators() {

        axios.put("/projects/add-user", {
            projectId: location.state.project._id,
            users: Array.from(selectedUserId)
        }).then(res => {
            console.log(res.data)
            setIsModalOpen(false)

        }).catch(err => {
            console.log(err)
        })

    }

    const send = () => {

        sendMessage('project-message', {
            message,
            sender: user
        })
        setMessages(prevMessages => [ ...prevMessages, { sender: user, message, timestamp: new Date() } ])
        setMessage("")

    }

   function WriteAiMessage(message) {
    const renderMarkdown = (text) => (
        <Markdown
            children={text}
            options={{ overrides: { code: SyntaxHighlightedCode } }}
        />
    )
    try {
        const messageObject = JSON.parse(message)
        return renderMarkdown(messageObject.text)
    } catch (err) {
        return renderMarkdown(message)
    }
}

    function formatTime(ts) {
        if (!ts) return ''
        const d = new Date(ts)
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    function getInitials(email) {
        if (!email) return '?'
        return email.charAt(0).toUpperCase()
    }

    useEffect(() => {

        initializeSocket(project._id)

        if (!webContainerRef.current) {
            getWebContainer().then(container => {
                setWebContainer(container)
                webContainerRef.current = container
                console.log("container started")

                // Register server-ready listener ONCE when container boots
                container.on('server-ready', (port, url) => {
                    console.log('server-ready', port, url)
                    setIframeUrl(url)
                })
            })
        }


        receiveMessage('project-message', data => {

            console.log(data)

            if (data.sender._id == 'ai') {

                let message;
                try {
                    message = JSON.parse(data.message);
                } catch (e) {
                    message = { text: data.message };
                }

                console.log(message)

                if (message.fileTree) {
                    webContainerRef.current?.mount(message.fileTree)
                    setFileTree(message.fileTree || {})
                }

                setMessages(prevMessages => [ ...prevMessages, { ...data, timestamp: new Date() } ])
            } else {

                setMessages(prevMessages => [ ...prevMessages, { ...data, timestamp: new Date() } ])
            }
        })


        axios.get(`/projects/get-project/${location.state.project._id}`).then(res => {

            console.log(res.data.project)

            setProject(res.data.project)
            setFileTree(res.data.project.fileTree || {})
        })

        axios.get('/users/all').then(res => {

            setUsers(res.data.users)

        }).catch(err => {

            console.log(err)

        })

    }, [])

    function saveFileTree(ft) {
        axios.put('/projects/update-file-tree', {
            projectId: project._id,
            fileTree: ft
        }).then(res => {
            console.log(res.data)
        }).catch(err => {
            console.log(err)
        })
    }


    // Removed appendIncomingMessage and appendOutgoingMessage functions

    function scrollToBottom() {
        messageBox.current.scrollTop = messageBox.current.scrollHeight
    }

    return (
        <main className='h-screen w-screen flex flex-col bg-gray-950 text-gray-100 font-sans overflow-hidden'>

            {/* ── TOP NAVBAR ───────────────────────────────────────────── */}
            <nav className='flex-shrink-0 flex items-center justify-between px-5 h-12 bg-gray-900/95 backdrop-blur-md border-b border-indigo-900/30 z-30 relative'>

                {/* Left — brand */}
                <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-900/40'>
                        <i className="ri-code-s-slash-fill text-white text-sm"></i>
                    </div>
                    <span className='text-sm font-bold tracking-tight'>
                        <span className='bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent'>CodeSync</span>
                        <span className='text-gray-200'> AI</span>
                    </span>
                    <span className='hidden sm:block w-px h-4 bg-indigo-900/60 mx-1'></span>
                    <span className='hidden sm:block text-xs text-gray-500 font-medium truncate max-w-[160px]'>{project.name}</span>
                </div>

                {/* Center — status pill */}
                <div className='absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/70 border border-indigo-900/30 text-[11px] text-gray-400'>
                    <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_#34d399]'></span>
                    Connected
                </div>

                {/* Right — actions */}
                <div className='flex items-center gap-2'>
                    <button
                        id="navbar-share-btn"
                        className='hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 rounded-lg transition-all duration-200'
                    >
                        <i className="ri-share-line"></i>
                        Share
                    </button>
                    <button
                        id="navbar-settings-btn"
                        className='p-2 rounded-lg text-gray-400 hover:text-indigo-300 hover:bg-indigo-950/50 transition-all duration-200'
                        title="Settings"
                    >
                        <i className="ri-settings-3-line text-sm"></i>
                    </button>
                    <div className='w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-xs font-bold shadow-md cursor-pointer' title={user?.email}>
                        {getInitials(user?.email)}
                    </div>
                </div>
            </nav>

            {/* ── CONTENT ROW (sidebar + editor) ───────────────────────── */}
            <div className='flex flex-1 min-h-0'>

            {/* ── LEFT SIDEBAR ─────────────────────────────────────────── */}
            <section className="left relative flex flex-col h-full min-w-96 bg-gray-900 border-r border-indigo-900/30 shadow-2xl">

                {/* Header */}
                <header className='flex justify-between items-center px-4 py-3 w-full bg-gray-900/95 backdrop-blur-md border-b border-indigo-900/30 absolute z-10 top-0'>
                    <button
                        id="add-collaborator-btn"
                        onClick={() => setIsModalOpen(true)}
                        className='flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-950/60 border border-indigo-700/50 rounded-lg hover:bg-indigo-800/40 hover:border-indigo-500 hover:text-indigo-100 transition-all duration-200'
                    >
                        <i className="ri-add-fill text-sm"></i>
                        Add Collaborator
                    </button>
                    <button
                        id="toggle-sidepanel-btn"
                        onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                        className='p-2 rounded-lg text-gray-400 hover:text-indigo-300 hover:bg-indigo-950/50 transition-all duration-200'
                    >
                        <i className="ri-group-fill text-lg"></i>
                    </button>
                </header>

                {/* Chat / Conversation Area */}
                <div className="conversation-area pt-14 pb-14 flex-grow flex flex-col h-full relative overflow-hidden">
                    <div
                        ref={messageBox}
                        className="message-box p-3 flex-grow flex flex-col gap-3 overflow-auto max-h-full scrollbar-hide"
                    >
                        {messages.map((msg, index) => {
                            const isAI    = msg.sender._id === 'ai'
                            const isOwn   = msg.sender._id === user._id.toString()
                            const initials = getInitials(msg.sender.email)

                            return (
                                <div
                                    key={index}
                                    className={`flex items-end gap-2 ${ isOwn ? 'flex-row-reverse' : 'flex-row' } ${ isAI ? 'w-full' : '' }`}
                                >
                                    {/* Avatar */}
                                    { !isOwn && (
                                        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold
                                            ${ isAI
                                                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-900/40'
                                                : 'bg-gray-700 text-gray-300'
                                            }`}
                                        >
                                            { isAI ? <i className="ri-sparkling-fill text-xs"></i> : initials }
                                        </div>
                                    )}

                                    {/* Bubble */}
                                    <div className={`
                                        flex flex-col gap-1
                                        ${ isAI ? 'w-full max-w-full' : isOwn ? 'max-w-[72%]' : 'max-w-[72%]' }
                                        ${ isOwn ? 'msg-animate-right items-end' : 'msg-animate-left items-start' }
                                    `}>

                                        {/* Sender label */}
                                        <span className={`text-[10px] font-semibold tracking-wider uppercase px-1
                                            ${ isAI ? 'text-indigo-400' : isOwn ? 'text-purple-400' : 'text-gray-500' }`}
                                        >
                                            { isAI ? '✦ AI Assistant' : isOwn ? 'You' : msg.sender.email }
                                        </span>

                                        {/* Message content */}
                                        { isAI ? (
                                            <div className="msg-ai-glow w-full rounded-xl border-l-2 border-indigo-500 bg-gray-900/80 border border-indigo-800/30 p-3 text-sm text-indigo-100 overflow-auto">
                                                {WriteAiMessage(msg.message)}
                                            </div>
                                        ) : (
                                            <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
                                                ${ isOwn
                                                    ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-tr-sm shadow-indigo-900/30'
                                                    : 'bg-gray-800 text-gray-200 border border-gray-700/50 rounded-tl-sm'
                                                }`}
                                            >
                                                {msg.message}
                                            </div>
                                        )}

                                        {/* Timestamp */}
                                        <span className="text-[10px] text-gray-600 px-1">
                                            {formatTime(msg.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Input Field */}
                    <div className="inputField w-full flex absolute bottom-0 border-t border-indigo-900/30 bg-gray-900/95 backdrop-blur-sm">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && send()}
                            className='p-3 px-4 bg-transparent border-none outline-none flex-grow text-sm text-gray-200 placeholder-gray-600'
                            type="text"
                            placeholder='Message the AI or team…'
                        />
                        <button
                            id="send-message-btn"
                            onClick={send}
                            className='px-4 text-indigo-400 hover:text-indigo-200 hover:bg-indigo-900/40 transition-all duration-200'
                        >
                            <i className="ri-send-plane-fill text-lg"></i>
                        </button>
                    </div>
                </div>

                {/* Side Panel – Collaborators */}
                <div className={`sidePanel w-full h-full flex flex-col bg-gray-900/98 border-r border-indigo-900/30 absolute transition-transform duration-300 ease-in-out ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0 z-20`}>
                    <header className='flex justify-between items-center px-4 py-3 border-b border-indigo-900/30 bg-gray-900/95 backdrop-blur-md'>
                        <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_6px_#818cf8] animate-pulse'></div>
                            <h1 className='font-semibold text-sm tracking-widest text-gray-200 uppercase'>Collaborators</h1>
                        </div>
                        <button
                            id="close-sidepanel-btn"
                            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                            className='p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-950/30 transition-all duration-200'
                        >
                            <i className="ri-close-fill text-lg"></i>
                        </button>
                    </header>

                    <div className="users flex flex-col gap-1 p-3 overflow-y-auto">
                        {project.users && project.users.map((user, index) => (
                            <div
                                key={index}
                                className="user cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-indigo-950/50 hover:border-indigo-700/30 border border-transparent transition-all duration-200 group"
                            >
                                <div className='relative aspect-square w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-700 to-purple-800 text-white text-sm shadow-md flex-shrink-0'>
                                    <i className="ri-user-fill"></i>
                                    <span className='absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-gray-900'></span>
                                </div>
                                <div className='flex flex-col min-w-0'>
                                    <span className='text-xs font-medium text-gray-300 truncate group-hover:text-indigo-200 transition-colors'>{user.email}</span>
                                    <span className='text-[10px] text-gray-600'>Member</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── RIGHT PANEL ──────────────────────────────────────────── */}
            <section className="right flex-grow h-full flex bg-gray-950 min-h-0">

                {/* File Explorer */}
                <div className="explorer h-full max-w-60 min-w-48 bg-gray-900/70 border-r border-indigo-900/20 flex flex-col">
                    <div className='px-4 py-2.5 border-b border-indigo-900/20'>
                        <p className='text-[10px] font-semibold tracking-widest text-gray-500 uppercase'>Explorer</p>
                    </div>
                    <div className="file-tree w-full flex flex-col gap-0.5 p-2 overflow-y-auto">
                        {Object.keys(fileTree).map((file, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentFile(file)
                                    setOpenFiles([ ...new Set([ ...openFiles, file ]) ])
                                }}
                                className={`tree-element w-full text-left cursor-pointer flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-all duration-150
                                    ${currentFile === file
                                        ? 'bg-indigo-900/50 text-indigo-200 border border-indigo-700/40'
                                        : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
                                    }`
                                }
                            >
                                <i className="ri-file-code-line text-xs text-indigo-500/70"></i>
                                <span className='font-medium truncate'>{file}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Code Editor */}
                <div className="code-editor flex flex-col flex-grow h-full shrink">

                    {/* Tab Bar */}
                    <div className="top flex justify-between w-full bg-gray-900/80 border-b border-indigo-900/20">
                        <div className="files flex overflow-x-auto scrollbar-hide">
                            {openFiles.map((file, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentFile(file)}
                                    className={`open-file cursor-pointer flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-r border-indigo-900/20 transition-all duration-150
                                        ${currentFile === file
                                            ? 'bg-gray-950 text-indigo-300 border-t-2 border-t-indigo-500'
                                            : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                                        }`
                                    }
                                >
                                    <i className="ri-file-code-line text-indigo-600/60"></i>
                                    {file}
                                </button>
                            ))}
                        </div>
                        <div className="actions flex items-center gap-2 px-3">
                            <button
                                id="run-btn"
                                onClick={async () => {
                                    const container = webContainerRef.current
                                    if (!container) {
                                        console.error("WebContainer not ready yet")
                                        return
                                    }

                                    console.log("Mounting file tree...")
                                    await container.mount(fileTree)

                                    console.log("Running npm install...")
                                    const installProcess = await container.spawn("npm", [ "install" ])

                                    installProcess.output.pipeTo(new WritableStream({
                                        write(chunk) {
                                            console.log("[install]", chunk)
                                        }
                                    }))

                                    const installExitCode = await installProcess.exit;
                                    console.log("npm install finished with exit code:", installExitCode)

                                    if (runProcess) {
                                        runProcess.kill()
                                    }

                                    console.log("Starting server...")
                                    let tempRunProcess = await container.spawn("npm", [ "start" ]);

                                    tempRunProcess.output.pipeTo(new WritableStream({
                                        write(chunk) {
                                            console.log("[server]", chunk)
                                        }
                                    }))

                                    setRunProcess(tempRunProcess)
                                }}
                                className='flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-emerald-600/20 text-emerald-400 border border-emerald-700/40 rounded-lg hover:bg-emerald-600/30 hover:border-emerald-500 hover:text-emerald-300 transition-all duration-200'
                            >
                                <i className="ri-play-fill"></i>
                                Run
                            </button>
                        </div>
                    </div>

                    {/* Editor Body */}
                    <div className="bottom flex flex-grow max-w-full shrink overflow-auto bg-gray-950">
                        {fileTree[ currentFile ] && (
                            <div className="code-editor-area h-full overflow-auto flex-grow">
                                <pre className="hljs h-full">
                                    <code
                                        className="hljs h-full outline-none"
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => {
                                            const updatedContent = e.target.innerText;
                                            const ft = {
                                                ...fileTree,
                                                [ currentFile ]: {
                                                    file: {
                                                        contents: updatedContent
                                                    }
                                                }
                                            }
                                            setFileTree(ft)
                                            saveFileTree(ft)
                                        }}
                                        dangerouslySetInnerHTML={{ __html: hljs.highlight('javascript', fileTree[ currentFile ].file.contents).value }}
                                        style={{
                                            whiteSpace: 'pre-wrap',
                                            paddingBottom: '25rem',
                                            counterSet: 'line-numbering',
                                        }}
                                    />
                                </pre>
                            </div>
                        )}
                    </div>
                </div>

                {/* Preview Iframe */}
                {iframeUrl && webContainer && (
                    <div className="flex min-w-96 flex-col h-full border-l border-indigo-900/20">
                        <div className="address-bar bg-gray-900/80 border-b border-indigo-900/20">
                            <input
                                type="text"
                                onChange={(e) => setIframeUrl(e.target.value)}
                                value={iframeUrl}
                                className="w-full px-4 py-2 bg-gray-950/80 text-xs text-gray-400 border-none outline-none placeholder-gray-700"
                            />
                        </div>
                        <iframe src={iframeUrl} className="w-full h-full bg-white"></iframe>
                    </div>
                )}

            </section>

            </div> {/* end content row */}

            {/* ── ADD COLLABORATOR MODAL ───────────────────────────────── */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-indigo-900/40 rounded-2xl shadow-2xl w-96 max-w-full relative overflow-hidden">
                        {/* Glow accent */}
                        <div className='absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent'></div>

                        <header className='flex justify-between items-center px-5 py-4 border-b border-indigo-900/30'>
                            <div className='flex items-center gap-2'>
                                <i className="ri-user-add-fill text-indigo-400"></i>
                                <h2 className='text-base font-semibold text-gray-100'>Add Collaborator</h2>
                            </div>
                            <button
                                id="close-modal-btn"
                                onClick={() => setIsModalOpen(false)}
                                className='p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-950/30 transition-all duration-200'
                            >
                                <i className="ri-close-fill text-lg"></i>
                            </button>
                        </header>

                        <div className="users-list flex flex-col gap-1 p-3 mb-16 max-h-80 overflow-y-auto">
                            {users.map(user => (
                                <div
                                    key={user._id}
                                    onClick={() => handleUserClick(user._id)}
                                    className={`user cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-150
                                        ${Array.from(selectedUserId).indexOf(user._id) !== -1
                                            ? 'bg-indigo-900/50 border-indigo-600/50 text-indigo-200'
                                            : 'border-transparent hover:bg-gray-800/60 hover:border-gray-700/40 text-gray-400 hover:text-gray-200'
                                        }`
                                    }
                                >
                                    <div className='relative aspect-square w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-700 to-purple-800 text-white text-sm shadow-md flex-shrink-0'>
                                        <i className="ri-user-fill"></i>
                                        {Array.from(selectedUserId).indexOf(user._id) !== -1 && (
                                            <span className='absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-gray-900 flex items-center justify-center'>
                                                <i className="ri-check-fill text-[8px] text-white"></i>
                                            </span>
                                        )}
                                    </div>
                                    <span className='text-sm font-medium truncate'>{user.email}</span>
                                </div>
                            ))}
                        </div>

                        <div className='absolute bottom-0 inset-x-0 p-4 bg-gray-900/95 border-t border-indigo-900/20 flex justify-center'>
                            <button
                                id="add-collaborators-confirm-btn"
                                onClick={addCollaborators}
                                className='px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-900/40 transition-all duration-200'
                            >
                                Add Selected Collaborators
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Project