import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;

public class MazeGame extends JFrame {
    private static final int WIDTH = 10;  // ширина лабиринта
    private static final int HEIGHT = 10; // высота лабиринта
    private static final int CELL_SIZE = 50; // размер одной клетки

    private int[][] maze;
    private Point playerPosition;
    private Point goalPosition;
    private int balance = 0;
    private JLabel balanceLabel;

    public MazeGame() {
        setTitle("Игра в Лабиринт");
        setSize(WIDTH * CELL_SIZE + 100, HEIGHT * CELL_SIZE + 100);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        initializeMaze();
        createGamePanel();

        setVisible(true);
    }

    private void initializeMaze() {
        // Определение структуры лабиринта, где 1 - стена, 0 - путь
        maze = new int[][]{
            {1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
            {1, 0, 0, 0, 1, 0, 0, 0, 0, 1},
            {1, 1, 1, 0, 1, 0, 1, 1, 0, 1},
            {1, 0, 0, 0, 0, 0, 0, 1, 0, 1},
            {1, 0, 1, 1, 1, 1, 0, 1, 1, 1},
            {1, 0, 1, 0, 0, 0, 0, 0, 0, 1},
            {1, 0, 1, 0, 1, 1, 1, 1, 0, 1},
            {1, 0, 0, 0, 0, 0, 0, 1, 0, 1},
            {1, 1, 1, 1, 1, 1, 0, 1, 1, 1},
            {1, 1, 1, 1, 1, 1, 0, 0, 0, 1},
        };
        playerPosition = new Point(1, 1); // начальная позиция игрока
        goalPosition = new Point(9, 9);   // позиция цели
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

        balanceLabel = new JLabel("Баланс: " + balance + "₽");
        balanceLabel.setFont(new Font("Arial", Font.BOLD, 16));
        balanceLabel.setForeground(Color.WHITE);

        JButton backButton = new JButton("Выход в меню");
        backButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                System.exit(0);
            }
        });

        JPanel mainPanel = new JPanel();
        mainPanel.setLayout(new BorderLayout());
        mainPanel.add(gamePanel, BorderLayout.CENTER);

        JPanel topPanel = new JPanel();
        topPanel.setBackground(Color.DARK_GRAY);
        topPanel.add(balanceLabel);
        topPanel.add(backButton);
        mainPanel.add(topPanel, BorderLayout.NORTH);

        add(mainPanel);

        gamePanel.setFocusable(true);
        gamePanel.addKeyListener(new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {
                movePlayer(e.getKeyCode());
                gamePanel.repaint();
                checkCompletion();
            }
        });
    }

    private void drawMaze(Graphics g) {
        for (int y = 0; y < HEIGHT; y++) {
            for (int x = 0; x < WIDTH; x++) {
                if (maze[y][x] == 1) {
                    g.setColor(Color.BLACK);
                } else if (x == goalPosition.x && y == goalPosition.y) {
                    g.setColor(Color.GREEN);
                } else {
                    g.setColor(Color.WHITE);
                }
                g.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                g.setColor(Color.GRAY);
                g.drawRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
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

        // Проверка, чтобы игрок не проходил сквозь стены
        if (newX >= 0 && newY >= 0 && newX < WIDTH && newY < HEIGHT && maze[newY][newX] == 0) {
            playerPosition.setLocation(newX, newY);
        }
    }

    private void checkCompletion() {
        if (playerPosition.equals(goalPosition)) {
            balance += 100;
            balanceLabel.setText("Баланс: " + balance + "₽");
            JOptionPane.showMessageDialog(this, "Поздравляем! Вы прошли лабиринт и заработали 100₽!");
            initializeMaze(); // Перезапускаем лабиринт
            repaint();
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(MazeGame::new);
    }
}
