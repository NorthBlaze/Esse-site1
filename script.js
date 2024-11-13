import javax.swing.*;
import java.awt.*;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public class MazeGame extends JFrame {
    private static final int WIDTH = 50;  // ширина лабиринта (в клетках)
    private static final int HEIGHT = 50; // высота лабиринта (в клетках)
    private static final int CELL_SIZE = 15; // размер одной клетки (в пикселях)
    private final int[][] maze = new int[HEIGHT][WIDTH];
    private final Point playerPosition = new Point(1, 1);
    private final Point endPosition = new Point(WIDTH - 2, HEIGHT - 2);

    public MazeGame() {
        setTitle("Игра в Лабиринт");
        setSize(WIDTH * CELL_SIZE, HEIGHT * CELL_SIZE);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setResizable(false);

        generateMaze();
        addKeyListener(new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {
                movePlayer(e.getKeyCode());
                repaint();
                if (playerPosition.equals(endPosition)) {
                    JOptionPane.showMessageDialog(MazeGame.this, "Вы выиграли!");
                    System.exit(0);
                }
            }
        });
    }

    @Override
    public void paint(Graphics g) {
        super.paint(g);
        drawMaze(g);
        drawPlayer(g);
    }

    private void drawMaze(Graphics g) {
        for (int y = 0; y < HEIGHT; y++) {
            for (int x = 0; x < WIDTH; x++) {
                if (maze[y][x] == 1) {
                    g.setColor(Color.BLACK);
                } else if (new Point(x, y).equals(endPosition)) {
                    g.setColor(Color.GREEN);
                } else {
                    g.setColor(Color.WHITE);
                }
                g.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }

    private void drawPlayer(Graphics g) {
        g.setColor(Color.BLUE);
        g.fillRect(playerPosition.x * CELL_SIZE, playerPosition.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }

    private void movePlayer(int keyCode) {
        int dx = 0, dy = 0;
        switch (keyCode) {
            case KeyEvent.VK_UP -> dy = -1;
            case KeyEvent.VK_DOWN -> dy = 1;
            case KeyEvent.VK_LEFT -> dx = -1;
            case KeyEvent.VK_RIGHT -> dx = 1;
        }
        int newX = playerPosition.x + dx;
        int newY = playerPosition.y + dy;
        if (newX >= 0 && newY >= 0 && newX < WIDTH && newY < HEIGHT && maze[newY][newX] == 0) {
            playerPosition.setLocation(newX, newY);
        }
    }

    private void generateMaze() {
        // Инициализация клеток стены
        for (int y = 0; y < HEIGHT; y++) {
            for (int x = 0; x < WIDTH; x++) {
                maze[y][x] = 1;
            }
        }
        // Генерация пути с использованием алгоритма случайного блуждания
        carvePath(1, 1);
    }

    private void carvePath(int x, int y) {
        maze[y][x] = 0;
        List<int[]> directions = new ArrayList<>(List.of(
            new int[]{0, -1}, // вверх
            new int[]{1, 0},  // вправо
            new int[]{0, 1},  // вниз
            new int[]{-1, 0}  // влево
        ));
        Collections.shuffle(directions, new Random());

        for (int[] dir : directions) {
            int newX = x + dir[0] * 2;
            int newY = y + dir[1] * 2;
            if (newX > 0 && newY > 0 && newX < WIDTH && newY < HEIGHT && maze[newY][newX] == 1) {
                maze[y + dir[1]][x + dir[0]] = 0;
                carvePath(newX, newY);
            }
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            MazeGame game = new MazeGame();
            game.setVisible(true);
        });
    }
}
