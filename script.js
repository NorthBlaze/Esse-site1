import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;

public class MazeGame extends JFrame {
    private static final int WIDTH = 15;  // ширина лабиринта
    private static final int HEIGHT = 15; // высота лабиринта
    private static final int CELL_SIZE = 40; // размер одной клетки

    private JPanel mainMenu;
    private JPanel gamePanel;
    private JPanel shopPanel;

    private int[][] maze;
    private Point playerPosition;
    private Color playerColor = Color.BLUE;

    public MazeGame() {
        setTitle("Игра в Лабиринт");
        setSize(WIDTH * CELL_SIZE, HEIGHT * CELL_SIZE + 50);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        initializeMaze();
        createMainMenu();
        createGamePanel();
        createShopPanel();

        add(mainMenu);  // Начинаем с главного меню
    }

    private void initializeMaze() {
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
        playerPosition = new Point(1, 1);
    }

    private void createMainMenu() {
        mainMenu = new JPanel();
        mainMenu.setLayout(new BoxLayout(mainMenu, BoxLayout.Y_AXIS));
        mainMenu.setBackground(Color.BLACK);

        JLabel title = new JLabel("Игра в Лабиринт");
        title.setFont(new Font("Arial", Font.BOLD, 24));
        title.setForeground(Color.WHITE);
        title.setAlignmentX(Component.CENTER_ALIGNMENT);

        JButton playButton = new JButton("Играть");
        playButton.setAlignmentX(Component.CENTER_ALIGNMENT);
        playButton.addActionListener(e -> startGame());

        JButton shopButton = new JButton("Магазин");
        shopButton.setAlignmentX(Component.CENTER_ALIGNMENT);
        shopButton.addActionListener(e -> openShop());

        mainMenu.add(Box.createVerticalStrut(50));
        mainMenu.add(title);
        mainMenu.add(Box.createVerticalStrut(20));
        mainMenu.add(playButton);
        mainMenu.add(Box.createVerticalStrut(10));
        mainMenu.add(shopButton);
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

        gamePanel.setFocusable(true);
        gamePanel.addKeyListener(new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {
                movePlayer(e.getKeyCode());
                repaint();
                if (playerPosition.equals(new Point(WIDTH - 2, HEIGHT - 2))) {
                    JOptionPane.showMessageDialog(gamePanel, "Вы выиграли!");
                    returnToMenu();
                }
            }
        });
    }

    private void createShopPanel() {
        shopPanel = new JPanel();
        shopPanel.setLayout(new FlowLayout());
        shopPanel.setBackground(Color.DARK_GRAY);

        JLabel shopTitle = new JLabel("Магазин - Выберите цвет скина");
        shopTitle.setForeground(Color.WHITE);
        shopTitle.setFont(new Font("Arial", Font.BOLD, 18));
        shopPanel.add(shopTitle);

        Color[] colors = {Color.BLUE, Color.RED, Color.GREEN, Color.YELLOW, Color.ORANGE, Color.PINK, Color.CYAN};
        for (Color color : colors) {
            JButton colorButton = new JButton();
            colorButton.setBackground(color);
            colorButton.setPreferredSize(new Dimension(50, 50));
            colorButton.addActionListener(e -> {
                playerColor = color;
                JOptionPane.showMessageDialog(shopPanel, "Скин изменен!");
            });
            shopPanel.add(colorButton);
        }

        JButton backButton = new JButton("Назад в меню");
        backButton.addActionListener(e -> returnToMenu());
        shopPanel.add(backButton);
    }

    private void startGame() {
        remove(mainMenu);
        add(gamePanel);
        gamePanel.requestFocusInWindow();
        repaint();
        revalidate();
    }

    private void openShop() {
        remove(mainMenu);
        add(shopPanel);
        repaint();
        revalidate();
    }

    private void returnToMenu() {
        remove(shopPanel);
        remove(gamePanel);
        add(mainMenu);
        repaint();
        revalidate();
    }

    private void drawMaze(Graphics g) {
        for (int y = 0; y < HEIGHT; y++) {
            for (int x = 0; x < WIDTH; x++) {
                if (maze[y][x] == 1) {
                    g.setColor(Color.BLACK);
                } else if (new Point(x, y).equals(new Point(WIDTH - 2, HEIGHT - 2))) {
                    g.setColor(Color.GREEN);
                } else {
                    g.setColor(Color.WHITE);
                }
                g.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }

    private void drawPlayer(Graphics g) {
        g.setColor(playerColor);
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

        if (newX >= 0 && newY >= 0 && newX < WIDTH && newY < HEIGHT && maze[newY][newX] == 0) {
            playerPosition.setLocation(newX, newY);
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            MazeGame game = new MazeGame();
            game.setVisible(true);
        });
    }
}
