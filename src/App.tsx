import { useState, useEffect } from "react"
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import { Dashboard } from "./dashboard/Dashboard"
import Login from "./auth/Login"
import { Navbar } from "./components/Navbar"

import { Landing } from "./pages/Landing"
import { Tutorial } from "./pages/Tutorial"
import { Pricing } from "./pages/Pricing"

/* ADMIN MODULES */

import { AdminDashboard } from "./pages/admin/AdminDashboard"
import { AdminToolsManager } from "./pages/admin/AdminToolsManager"
import { AdminLicensesManager } from "./pages/admin/AdminLicensesManager"
import { AdminUsersManager } from "./pages/admin/AdminUsersManager"
import { AdminAnalytics } from "./pages/admin/AdminAnalytics"
import { AdminRevenue } from "./pages/admin/AdminRevenue"

/* ADMIN EMAIL */

const ADMIN_EMAILS = [
"wisnuhadi579@gmail.com"
]

/* NORMALIZE EMAIL */

const normalizeEmail = (email:string) => {
return email?.toLowerCase().trim()
}

/* USER PROTECTED ROUTE */

const ProtectedRoute = ({ user, children }: any) => {

if (!user) {
return <Navigate to="/login" replace />
}

return children

}

/* ADMIN PROTECTED ROUTE */

const AdminRoute = ({ user, children }: any) => {

if (!user) {
return <Navigate to="/login" replace />
}

const email = normalizeEmail(user.email)

const isAdmin = ADMIN_EMAILS
.map(e => normalizeEmail(e))
.includes(email)

if (!isAdmin) {
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

{/* PUBLIC */}

<Route path="/" element={<Landing />} />

<Route path="/tutorial" element={<Tutorial />} />

<Route path="/pricing" element={<Pricing />} />

<Route
path="/login"
element={<Login onLogin={setUser} />}
/>

{/* USER DASHBOARD */}

<Route
path="/dashboard"
element={
<ProtectedRoute user={user}>
<Dashboard />
</ProtectedRoute>
}
/>

{/* ADMIN DASHBOARD */}

<Route
path="/admin"
element={
<AdminRoute user={user}>
<AdminDashboard />
</AdminRoute>
}
/>

{/* TOOLS MANAGER */}

<Route
path="/admin/tools"
element={
<AdminRoute user={user}>
<AdminToolsManager />
</AdminRoute>
}
/>

{/* LICENSE MANAGER */}

<Route
path="/admin/licenses"
element={
<AdminRoute user={user}>
<AdminLicensesManager />
</AdminRoute>
}
/>

{/* USERS MANAGER */}

<Route
path="/admin/users"
element={
<AdminRoute user={user}>
<AdminUsersManager />
</AdminRoute>
}
/>

{/* ANALYTICS */}

<Route
path="/admin/analytics"
element={
<AdminRoute user={user}>
<AdminAnalytics />
</AdminRoute>
}
/>

{/* REVENUE */}

<Route
path="/admin/revenue"
element={
<AdminRoute user={user}>
<AdminRevenue />
</AdminRoute>
}
/>

{/* FALLBACK */}

<Route path="*" element={<Navigate to="/dashboard" replace />} />

</Routes>

</div>

</Router>

)

}
