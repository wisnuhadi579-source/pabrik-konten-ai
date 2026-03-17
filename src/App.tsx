import { useState, useEffect } from "react"
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import { Dashboard } from "./dashboard/Dashboard"
import Login from "./auth/Login"
import { Navbar } from "./components/Navbar"

import { Landing } from "./pages/Landing"
import { Tutorial } from "./pages/Tutorial"
import { Pricing } from "./pages/Pricing"
import { Admin } from "./pages/Admin"

import { AdminToolsPro } from "./pages/admin/AdminToolsPro"

const ADMIN_EMAILS = [
"[wisnuhadi579@gmail.com](mailto:wisnuhadi579@gmail.com)"
]

const ProtectedRoute = ({ user, children }: any) => {

if (!user) {
return <Navigate to="/login" replace />
}

return children

}

const AdminRoute = ({ user, children }: any) => {

if (!user) {
return <Navigate to="/login" replace />
}

if (!ADMIN_EMAILS.includes(user.email)) {
return <Navigate to="/dashboard" replace />
}

return children

}

export default function App() {

const [user, setUser] = useState<any>(null)
const [loading, setLoading] = useState(true)

useEffect(() => {

const session = localStorage.getItem("userSession")

if (session) {

try {

const data = JSON.parse(session)

if (data && data.loggedIn) {
setUser(data)
}

} catch (e) {

console.error(e)
localStorage.removeItem("userSession")

}

}

setLoading(false)

}, [])

if (loading) return null

return (

<Router>

<div className="min-h-screen bg-black text-white">

<Navbar />

<Routes>

<Route path="/" element={<Landing />} />

<Route path="/tutorial" element={<Tutorial />} />

<Route path="/pricing" element={<Pricing />} />

<Route
path="/login"
element={<Login onLogin={setUser} />}
/>

<Route
path="/dashboard"
element={ <ProtectedRoute user={user}> <Dashboard /> </ProtectedRoute>
}
/>

<Route
path="/admin"
element={ <AdminRoute user={user}> <Admin /> </AdminRoute>
}
/>

<Route
path="/admin/tools"
element={ <AdminRoute user={user}> <AdminToolsPro /> </AdminRoute>
}
/>

<Route path="*" element={<Navigate to="/" replace />} />

</Routes>

</div>

</Router>

)

}
