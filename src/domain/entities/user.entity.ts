export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly username: string,
    public readonly password: string,
    public readonly created_at: Date,
    public readonly updated_at: Date,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.email.includes('@')) throw new Error('Invalid email format.');
    if (this.username.length < 3) throw new Error('Username must be at least 3 characters.');
    if (this.password.length < 6) throw new Error('Password must be at least 6 characters.');
  }
}
