import java.util.Scanner;

public class login {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("=== Employee Management System ===");
        System.out.print("Enter username: ");
        String username = scanner.nextLine();
        
        System.out.print("Enter password: ");
        String password = scanner.nextLine();
        
        if (validateLogin(username, password)) {
            System.out.println("Login successful! Welcome, " + username);
        } else {
            System.out.println("Invalid credentials. Please try again.");
        }
        
        scanner.close();
    }
    
    public static boolean validateLogin(String username, String password) {
        String validUsername = "admin";
        String validPassword = "password123";
        return username.equals(validUsername) && password.equals(validPassword);
    }
}