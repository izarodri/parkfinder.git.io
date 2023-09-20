/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Main.java to edit this template
 */
package javaapplication1;
 import java.util.Random;
/**
 *
 * @author j_ped
 */
public class JavaApplication1 {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
      Random random = new Random();
            int numeroAleatorio = random.nextInt(9000) + 1000;System.out.println(numeroAleatorio);
    }
    
}
