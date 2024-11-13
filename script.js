import javax.swing.*;
import java.awt.*;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;

public class MazeGameWithScare extends JFrame {
    private static final int WIDTH = 15;  // ширина лабиринта
    private static final int HEIGHT = 15; // высота лабиринта
    private static final int CELL_SIZE = 40; // размер одной клетки

    private int[][] maze;
    private Point playerPosition;
    private final Point endPosition = new Point(WIDTH - 2, HEIGHT - 2);
    private boolean gameCompleted = false;

    public MazeGameWithScare() {
        setTitle("Игра в Лабиринт");
        setSize(WIDTH * CELL_SIZE, HEIGHT * CELL_SIZE + 50);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        initializeMaze();
        createGamePanel();

        setVisible(true);
    }

    private void initializeMaze() {
        // Определение структуры лабиринта, где 1 - стена, 0 - путь
        maze = new int[][]{
            {1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
            {1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1},
            {1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1},
            {1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1},
            {1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1},
            {1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1},
            {1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1},
            {1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1},
            {1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1},
            {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
            {1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1}
        };
        playerPosition = new Point(1, 1);  // начальная позиция игрока
    }

    private void createGamePanel() {
        JPanel gamePanel = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                drawMaze(g);
                drawPlayer(g);
            }
        };
        gamePanel.setPreferredSize(new Dimension(WIDTH * CELL_SIZE, HEIGHT * CELL_SIZE));
        gamePanel.setBackground(Color.BLACK);

        gamePanel.setFocusable(true);
        gamePanel.addKeyListener(new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {
                if (!gameCompleted) {
                    movePlayer(e.getKeyCode());
                    repaint();
                    checkCompletion();
                }
            }
        });

        add(gamePanel);
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
            case KeyEvent.VK_W -> dy = -1;
            case KeyEvent.VK_S -> dy = 1;
            case KeyEvent.VK_A -> dx = -1;
            case KeyEvent.VK_D -> dx = 1;
        }
        int newX = playerPosition.x + dx;
        int newY = playerPosition.y + dy;

        // Проверка на границы и стены лабиринта
        if (newX >= 0 && newY >= 0 && newX < WIDTH && newY < HEIGHT && maze[newY][newX] == 0) {
            playerPosition.setLocation(newX, newY);
        }
    }

    private void checkCompletion() {
        if (playerPosition.equals(endPosition)) {
            gameCompleted = true;
            showScareImage();
        }
    }

    private void showScareImage() {
        // Создаем диалог с изображением (скример)
        JDialog scareDialog = new JDialog(this, "Скример", true);
        scareDialog.setSize(400, 400);
        scareDialog.setLocationRelativeTo(this);

        JLabel scareLabel = new JLabel(new ImageIcon("scary_image.jpg")); // Убедитесь, что изображение "scary_image.jpg" доступно
        scareDialog.add(scareLabel);
        scareDialog.setVisible(true);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new MazeGameWithScare());
    }
}
