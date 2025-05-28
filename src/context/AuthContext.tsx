import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import supabase from "../api/supabaseClient";
import { User,Session } from "@supabase/supabase-js";

type Props = {
  children: ReactNode
}

//type of info we want to store in context
interface AuthContextType {
  user: User|null,
  signInWithGoogle: () => void, //Promise<void>?
  signOut: () => void,

}

const AppContext = createContext<AuthContextType|undefined>(undefined);

const AppContextProvider = ({ children }:Props) => {
  let myChannel = null;
  const [user, setUser] = useState<User|null>(null);
  const [username, setUsername] = useState<string|undefined>("");
  const [session, setSession] = useState<Session|null>(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [routeHash, setRouteHash] = useState("");
  const [isOnBottom, setIsOnBottom] = useState(false);
  const [newIncomingMessageTrigger, setNewIncomingMessageTrigger] =
    useState(null);
  const [unviewedMessageCount, setUnviewedMessageCount] = useState(0);
  const [countryCode, setCountryCode] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(false);

  useEffect(() => {
    // Effect to scroll to bottom on initial message load
    if (isInitialLoad) {
      setIsInitialLoad(false);
      scrollToBottom();
    }
  }, [messages]);


  const signInWithGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: '/',
      },
    });
  }
  const getLocation = async () => {
    try {
      const res = await fetch("https://api.db-ip.com/v2/free/self");
      const { countryCode, error } = await res.json();
      if (error) throw new Error(error);

      setCountryCode(countryCode);
      localStorage.setItem("countryCode", countryCode);
    } catch (error: any) {
      console.error(
        `error getting location from api.db-ip.com:`,
        error.message
      );
    }
  };

  const randomUsername = () => {
    return `@user${Date.now().toString().slice(-4)}`;
  };
  const initializeUser = (session:Session) => {
    setSession(session);
    // const {
    //   data: { session },
    // } = await supabase.auth.getSession();

    let username;
    if (session) {
      setUser(session.user);
      username = session.user.user_metadata.username;
    } else {
      username = localStorage.getItem("username") || randomUsername();
    }
    setUsername(username);
    localStorage.setItem("username", username);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      initializeUser(session);
    });

    getMessagesAndSubscribe();

    const storedCountryCode = localStorage.getItem("countryCode");
    if (storedCountryCode && storedCountryCode !== "undefined")
      setCountryCode(storedCountryCode);
    else getLocation();

    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("onAuthStateChange", { _event, session });
      initializeUser(session);
    });

    // const { hash, pathname } = window.location;
    // if (hash && pathname === "/") {
    //   console.log("hash", hash);
    //   setRouteHash(hash);
    // }

    return () => {
      // Remove supabase channel subscription by useEffect unmount
      if (myChannel) {
        supabase.removeChannel(myChannel);
      }

      authSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!newIncomingMessageTrigger) return;

    if (newIncomingMessageTrigger.username === username) {
      scrollToBottom();
    } else {
      setUnviewedMessageCount((prevCount) => prevCount + 1);
    }
  }, [newIncomingMessageTrigger]);

  const handleNewMessage = (payload) => {
    setMessages((prevMessages) => [payload.new, ...prevMessages]);
    //* needed to trigger react state because I need access to the username state
    setNewIncomingMessageTrigger(payload.new);
  };

  const getInitialMessages = async () => {
    if (messages.length) return;

    const { data, error } = await supabase
      .from("messages")
      .select()
      .range(0, 49)
      .order("id", { ascending: false });
    // console.log(`data`, data);

    setLoadingInitial(false);
    if (error) {
      setError(error.message);
      return;
    }

    setIsInitialLoad(true);
    setMessages(data);
    // scrollToBottom(); // not sure why this stopped working, meanwhile using useEffect that's listening to messages and isInitialLoad state.
  };

  const getMessagesAndSubscribe = async () => {
    setError("");

    await getInitialMessages();

    if (!myChannel) {
      // mySubscription = supabase
      // .from("messages")
      // .on("*", (payload) => {
      //   handleNewMessage(payload);
      // })
      // .subscribe();

      myChannel = supabase
        .channel("custom-all-channel")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "messages" },
          (payload) => {
            handleNewMessage(payload);
          }
        )
        .subscribe();
    }
  };

  const scrollRef = useRef();
  const onScroll = async ({ target }) => {
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 1) {
      setUnviewedMessageCount(0);
      setIsOnBottom(true);
    } else {
      setIsOnBottom(false);
    }

    //* Load more messages when reaching top
    if (target.scrollTop === 0) {
      // console.log("messages.length :>> ", messages.length);
      const { data, error } = await supabase
        .from("messages")
        .select()
        .range(messages.length, messages.length + 49)
        .order("id", { ascending: false });
      if (error) {
        setError(error.message);
        return;
      }
      target.scrollTop = 1;
      setMessages((prevMessages) => [...prevMessages, ...data]);
    }
  };

  const scrollToBottom = () => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  return (
    <AppContext.Provider
      value={{
        messages,
        loadingInitial,
        error,
        getMessagesAndSubscribe,
        username,
        setUsername,
        randomUsername,
        routeHash,
        scrollRef,
        onScroll,
        scrollToBottom,
        isOnBottom,
        country: countryCode,
        unviewedMessageCount,
        session,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export { AppContext as default, AppContextProvider, useAppContext };