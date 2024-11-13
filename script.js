import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;

public class MazeGameWithMenu extends JFrame {
    private static final int WIDTH = 10;  // ширина лабиринта
    private static final int HEIGHT = 10; // высота лабиринта
    private static final int CELL_SIZE = 50; // размер одной клетки

    private JPanel mainMenu;
    private JPanel gamePanel;
    private JLabel balanceLabel;
    private int balance = 0;

    private int[][] maze;
    private Point playerPosition;
    private Point goalPosition;

    public MazeGameWithMenu() {
        setTitle("Игра в Лабиринт");
        setSize(WIDTH * CELL_SIZE + 100, HEIGHT * CELL_SIZE + 100);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new CardLayout());

        initializeMaze();
        createMainMenu();
        createGamePanel();

        add(mainMenu, "MainMenu");
        add(gamePanel, "GamePanel");

        setVisible(true);
    }

    private void initializeMaze() {
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
        playerPosition = new Point(1, 1);
        goalPosition = new Point(8, 9);
    }

    private void createMainMenu() {
        mainMenu = new JPanel();
        mainMenu.setLayout(new BoxLayout(mainMenu, BoxLayout.Y_AXIS));
        mainMenu.setBackground(Color.DARK_GRAY);

        JLabel title = new JLabel("Игра в Лабиринт");
        title.setFont(new Font("Arial", Font.BOLD, 24));
        title.setForeground(Color.WHITE);
        title.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel instruction = new JLabel("Выберите уровень, чтобы начать игру и зарабатывать баланс!");
        instruction.setForeground(Color.WHITE);
        instruction.setAlignmentX(Component.CENTER_ALIGNMENT);

        JButton playButton = new JButton("Играть");
        playButton.setAlignmentX(Component.CENTER_ALIGNMENT);
        playButton.addActionListener(e -> showGamePanel());

        mainMenu.add(Box.createVerticalStrut(50));
        mainMenu.add(title);
        mainMenu.add(Box.createVerticalStrut(20));
        mainMenu.add(instruction);
        mainMenu.add(Box.createVerticalStrut(20));
        mainMenu.add(playButton);
    }

    private void createGamePanel() {
        gamePanel = new JPanel() {
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

        JButton backButton = new JButton("Вернуться в меню");
        backButton.addActionListener(e -> showMainMenu());

        JPanel topPanel = new JPanel();
        topPanel.setBackground(Color.DARK_GRAY);
        topPanel.add(balanceLabel);
        topPanel.add(backButton);

        gamePanel.setLayout(new BorderLayout());
        gamePanel.add(topPanel, BorderLayout.NORTH);

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

        // Проверка на границы и стены
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
            playerPosition.setLocation(1, 1); // Сброс позиции игрока
            repaint();
        }
    }

    private void showGamePanel() {
        CardLayout cl = (CardLayout) getContentPane().getLayout();
        cl.show(getContentPane(), "GamePanel");
        gamePanel.requestFocusInWindow(); // Переключение фокуса для отслеживания нажатий клавиш
    }

    private void showMainMenu() {
        CardLayout cl = (CardLayout) getContentPane().getLayout();
        cl.show(getContentPane(), "MainMenu");
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(MazeGameWithMenu::new);
    }
}
