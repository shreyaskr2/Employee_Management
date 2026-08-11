import java.util.Scanner;

public class Register {
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("=== Employee Registration System ===");
        System.out.print("Enter employee name: ");
        String name = scanner.nextLine();
        
        System.out.print("Enter employee ID: ");
        int empId = scanner.nextInt();
        
        System.out.print("Enter department: ");
        scanner.nextLine();
        String department = scanner.nextLine();
        
        System.out.print("Enter salary: ");
        double salary = scanner.nextDouble();
        
        displayEmployeeInfo(name, empId, department, salary);
        scanner.close();
    }
    
    public static void displayEmployeeInfo(String name, int id, String dept, double sal) {
        System.out.println("\n=== Employee Information ===");
        System.out.println("Name: " + name);
        System.out.println("ID: " + id);
        System.out.println("Department: " + dept);
        System.out.println("Salary: $" + sal);
    }
}
