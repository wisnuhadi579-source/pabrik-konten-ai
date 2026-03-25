const handleAuth = async () => {

  setIsLoading(true);
  setError("");

  try {

    if (authMode === "login") {

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // 🔥 ambil user dari supabase auth
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("User tidak ditemukan");

      // 🔥 AUTO LINK LICENSE (INI INTI NYA)
      await supabase
        .from("licenses")
        .update({ user_id: user.id })
        .eq("email", user.email)
        .is("user_id", null);

      // 🔥 AMBIL PLAN DARI LICENSE (bukan dari table users lagi)
      const { data: licenses } = await supabase
        .from("licenses")
        .select("plan")
        .eq("user_id", user.id)
        .eq("status", "active");

      let memberStatus = "Gratis";

      if (licenses && licenses.length > 0) {
        const plans = licenses.map(l => l.plan);

        if (plans.includes("vip")) memberStatus = "VIP";
        else if (plans.includes("premium")) memberStatus = "Premium";
      }

      const sessionData = {
        email: email,
        member: memberStatus,
        loggedIn: true
      };

      localStorage.setItem("userSession", JSON.stringify(sessionData));

      onLogin(sessionData);

      navigate("/dashboard");

    } else {

      /* REGISTER USER */

      const { error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {

        if(error.message.includes("User already registered")){
          throw new Error(
            "Akun sudah terdaftar. Silakan klik 'Lupa Kata Sandi' untuk membuat password."
          )
        }

        throw error;
      }

      /* SIMPAN USER KE DATABASE */

      await supabase
        .from("users")
        .upsert({
          email: email,
          plan: "free"
        }, { onConflict: "email" });

      alert("Registrasi berhasil! Silahkan login.");

      setAuthMode("login");

    }

  } catch (error: any) {

    setError(error.message);

  } finally {

    setIsLoading(false);

  }

};
