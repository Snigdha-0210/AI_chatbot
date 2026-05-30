export const users = [
  {
    id: "user_1",
    name: "Snigdha",
    email: "snigdha7185@gmail.com",
    password: "1234",
    verified: true
  },
  {
    id: "user_2",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    password: "1234",
    verified: true
  },
  {
    id: "user_3",
    name: "Aditi Singh",
    email: "aditi@example.com",
    password: "1234",
    verified: false
  }
];

export function loginUser(email?: string, password?: string) {
  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) throw new Error("Invalid credentials");
  if (!user.verified) throw new Error("Please verify your account first");

  return user;
}

export function registerUser(name?: string, email?: string, password?: string) {
  if (!name || !email || !password) throw new Error("Please fill in all fields");

  const exists = users.find(u => u.email === email);
  if (exists) throw new Error("User already exists");

  const newUser = {
    id: "user_" + Date.now(),
    name,
    email,
    password,
    verified: false
  };

  users.push(newUser);
  return newUser;
}

export function verifyUser(email: string) {
  const user = users.find(u => u.email === email);
  if (user) {
    user.verified = true;
    return user;
  }
  throw new Error("User not found");
}
