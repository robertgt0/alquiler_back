#!/usr/bin/env python3
import http.server
import socketserver
import sqlite3
import hashlib
import json
import datetime
import threading
import webbrowser
import random
import time
import os
from urllib.parse import parse_qs, urlparse
from typing import List, Dict, Optional
from dataclasses import dataclass
from enum import Enum

# Configuración
PORT = 8000
DB_NAME = "p2p_trading.db"

# Datos para generación aleatoria
RANDOM_NAMES = [
    "CryptoMaster", "BitcoinPro", "ElonMusk", "SatoshiNakamoto", "DigitalTrader",
    "BlockchainKing", "CryptoWhale", "TradingExpert", "Web3Enthusiast", "DeFiMaster"
]

RANDOM_PAYMENT_METHODS = [
    ["Bank Transfer", "PayPal"],
    ["Bank Transfer", "Wise", "Revolut"],
    ["PayPal", "Credit Card"],
    ["Bank Transfer", "Cash Deposit"],
    ["Wise", "PayPal", "Bank Transfer"]
]

ASSETS = ["USDT", "BTC", "ETH"]
FIATS = ["USD", "EUR"]

class OrderType(Enum):
    BUY = "BUY"
    SELL = "SELL"

class OrderStatus(Enum):
    PENDING = "PENDING"
    PARTIALLY_FILLED = "PARTIALLY_FILLED"
    FILLED = "FILLED"
    CANCELLED = "CANCELLED"

class TradeStatus(Enum):
    PENDING_PAYMENT = "PENDING_PAYMENT"
    PAYMENT_SENT = "PAYMENT_SENT"
    PAYMENT_CONFIRMED = "PAYMENT_CONFIRMED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

@dataclass
class User:
    id: int
    username: str
    email: str
    created_at: str

@dataclass
class P2POrder:
    id: int
    user_id: int
    username: str
    order_type: OrderType
    asset: str
    fiat: str
    price: float
    quantity: float
    available_quantity: float
    payment_methods: List[str]
    status: OrderStatus
    created_at: str
    min_amount: float
    max_amount: float

class P2PSystem:
    def __init__(self, db_name: str = DB_NAME):
        self.db_name = db_name
        self.init_database()
    
    def init_database(self):
        # Eliminar base de datos existente para forzar recreación
        if os.path.exists(self.db_name):
            os.remove(self.db_name)
            
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        
        # Tabla de usuarios
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL,
                reputation INTEGER DEFAULT 100,
                completed_trades INTEGER DEFAULT 0
            )
        ''')
        
        # Tabla de órdenes P2P
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS p2p_orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                order_type TEXT NOT NULL,
                asset TEXT NOT NULL,
                fiat TEXT NOT NULL,
                price REAL NOT NULL,
                quantity REAL NOT NULL,
                available_quantity REAL NOT NULL,
                payment_methods TEXT NOT NULL,
                status TEXT NOT NULL,
                min_amount REAL NOT NULL,
                max_amount REAL NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Tabla de trades
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS trades (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                buyer_id INTEGER NOT NULL,
                seller_id INTEGER NOT NULL,
                order_id INTEGER NOT NULL,
                asset TEXT NOT NULL,
                fiat TEXT NOT NULL,
                price REAL NOT NULL,
                quantity REAL NOT NULL,
                amount REAL NOT NULL,
                status TEXT NOT NULL,
                created_at TEXT NOT NULL,
                qr_code TEXT,
                payment_deadline TEXT,
                FOREIGN KEY (buyer_id) REFERENCES users (id),
                FOREIGN KEY (seller_id) REFERENCES users (id),
                FOREIGN KEY (order_id) REFERENCES p2p_orders (id)
            )
        ''')
        
        # Tabla de wallets
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS wallets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                asset TEXT NOT NULL,
                balance REAL NOT NULL,
                locked_balance REAL NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Insertar datos de ejemplo
        self._create_sample_data(cursor)
        
        conn.commit()
        conn.close()
        print("✅ Base de datos creada correctamente")
    
    def _create_sample_data(self, cursor):
        """Crear datos de ejemplo"""
        users_data = [
            ("trader1", "trader1@example.com", "password123"),
            ("trader2", "trader2@example.com", "password123"),
            ("trader3", "trader3@example.com", "password123")
        ]
        
        for username, email, password in users_data:
            try:
                password_hash = hashlib.sha256(password.encode()).hexdigest()
                created_at = datetime.datetime.now().isoformat()
                cursor.execute(
                    'INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, ?)',
                    (username, email, password_hash, created_at)
                )
                user_id = cursor.lastrowid
                print(f"✅ Usuario creado: {username}")
                
                # Crear wallets
                assets = [
                    ('USDT', 5000.0), ('BTC', 0.5), ('ETH', 3.0), 
                    ('USD', 10000.0), ('EUR', 8000.0)
                ]
                for asset, balance in assets:
                    cursor.execute(
                        'INSERT INTO wallets (user_id, asset, balance, locked_balance) VALUES (?, ?, ?, ?)',
                        (user_id, asset, balance, 0.0)
                    )
                    
            except sqlite3.IntegrityError:
                print(f"⚠️ Usuario {username} ya existe")
                continue
        
        # Crear anuncios iniciales
        self._generate_random_orders(cursor, num_orders=8)
    
    def _generate_random_orders(self, cursor, num_orders=8):
        """Genera órdenes aleatorias de compra y venta"""
        for i in range(num_orders):
            try:
                cursor.execute("SELECT id FROM users ORDER BY RANDOM() LIMIT 1")
                user_result = cursor.fetchone()
                if not user_result:
                    continue
                    
                user_id = user_result[0]
                order_type = random.choice(['BUY', 'SELL'])
                asset = random.choice(ASSETS)
                fiat = random.choice(FIATS)
                
                # Precios base
                base_prices = {
                    'USDT': {'USD': 1.0, 'EUR': 0.92},
                    'BTC': {'USD': 45000.0, 'EUR': 41400.0},
                    'ETH': {'USD': 2800.0, 'EUR': 2576.0}
                }
                
                base_price = base_prices[asset][fiat]
                if order_type == 'SELL':
                    price_variation = random.uniform(0.01, 0.03)
                else:
                    price_variation = random.uniform(-0.03, -0.01)
                
                price = base_price * (1 + price_variation)
                price = round(price, 2)
                
                # Cantidades
                quantity_ranges = {
                    'USDT': (100, 1000),
                    'BTC': (0.01, 0.1),
                    'ETH': (0.1, 2.0)
                }
                min_qty, max_qty = quantity_ranges[asset]
                quantity = round(random.uniform(min_qty, max_qty), 2)
                
                payment_methods = random.choice(RANDOM_PAYMENT_METHODS)
                min_amount = round(random.uniform(50, 200), 2)
                max_amount = round(quantity * price * 0.8, 2)
                
                created_at = datetime.datetime.now().isoformat()
                payment_json = json.dumps(payment_methods)
                
                cursor.execute('''
                    INSERT INTO p2p_orders 
                    (user_id, order_type, asset, fiat, price, quantity, available_quantity, 
                     payment_methods, status, min_amount, max_amount, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (user_id, order_type, asset, fiat, price, quantity, quantity,
                      payment_json, 'PENDING', min_amount, max_amount, created_at))
                
                print(f"✅ Anuncio {order_type} {asset}/{fiat} a {price}")
                
            except Exception as e:
                print(f"❌ Error creando anuncio: {e}")
    
    def hash_password(self, password: str) -> str:
        return hashlib.sha256(password.encode()).hexdigest()
    
    def register_user(self, username: str, email: str, password: str) -> bool:
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            password_hash = self.hash_password(password)
            created_at = datetime.datetime.now().isoformat()
            
            cursor.execute('''
                INSERT INTO users (username, email, password_hash, created_at)
                VALUES (?, ?, ?, ?)
            ''', (username, email, password_hash, created_at))
            
            user_id = cursor.lastrowid
            initial_assets = [
                ('USDT', 1000.0), ('BTC', 0.01), ('ETH', 0.1), 
                ('USD', 2000.0), ('EUR', 1600.0)
            ]
            for asset, balance in initial_assets:
                cursor.execute('''
                    INSERT INTO wallets (user_id, asset, balance, locked_balance)
                    VALUES (?, ?, ?, ?)
                ''', (user_id, asset, balance, 0.0))
            
            conn.commit()
            conn.close()
            return True
        except sqlite3.IntegrityError:
            return False
    
    def authenticate_user(self, username: str, password: str) -> Optional[User]:
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        
        password_hash = self.hash_password(password)
        cursor.execute('''
            SELECT id, username, email, created_at FROM users 
            WHERE username = ? AND password_hash = ?
        ''', (username, password_hash))
        
        result = cursor.fetchone()
        conn.close()
        
        if result:
            return User(*result)
        return None
    
    def get_user_stats(self, user_id: int) -> Dict[str, any]:
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        
        cursor.execute('SELECT reputation, completed_trades FROM users WHERE id = ?', (user_id,))
        result = cursor.fetchone()
        
        stats = {
            'reputation': result[0] if result else 100,
            'completed_trades': result[1] if result else 0,
            'trust_level': "✅ Confiable"
        }
        
        conn.close()
        return stats
    
    def create_order(self, user_id: int, order_type: str, asset: str, fiat: str, 
                    price: float, quantity: float, payment_methods: List[str],
                    min_amount: float, max_amount: float) -> bool:
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            # Validar fondos
            if order_type == 'SELL':
                cursor.execute('''
                    SELECT balance FROM wallets 
                    WHERE user_id = ? AND asset = ?
                ''', (user_id, asset))
                result = cursor.fetchone()
                if not result or result[0] < quantity:
                    return False
            else:  # BUY
                cursor.execute('''
                    SELECT balance FROM wallets 
                    WHERE user_id = ? AND asset = ?
                ''', (user_id, fiat))
                result = cursor.fetchone()
                total_amount = price * quantity
                if not result or result[0] < total_amount:
                    return False
            
            created_at = datetime.datetime.now().isoformat()
            payment_methods_json = json.dumps(payment_methods)
            
            cursor.execute('''
                INSERT INTO p2p_orders 
                (user_id, order_type, asset, fiat, price, quantity, available_quantity, 
                 payment_methods, status, min_amount, max_amount, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (user_id, order_type, asset, fiat, price, quantity, quantity,
                  payment_methods_json, OrderStatus.PENDING.value, min_amount, max_amount, created_at))
            
            # Bloquear fondos
            if order_type == 'SELL':
                cursor.execute('''
                    UPDATE wallets 
                    SET balance = balance - ?, locked_balance = locked_balance + ?
                    WHERE user_id = ? AND asset = ?
                ''', (quantity, quantity, user_id, asset))
            else:  # BUY
                total_amount = price * quantity
                cursor.execute('''
                    UPDATE wallets 
                    SET balance = balance - ?, locked_balance = locked_balance + ?
                    WHERE user_id = ? AND asset = ?
                ''', (total_amount, total_amount, user_id, fiat))
            
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(f"Error creating order: {e}")
            return False
    
    def get_orders(self, asset: str = "USDT", fiat: str = "USD", order_type: str = None) -> List[P2POrder]:
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        
        query = '''
            SELECT po.id, po.user_id, u.username, po.order_type, po.asset, po.fiat, po.price, 
                   po.quantity, po.available_quantity, po.payment_methods, po.status, 
                   po.min_amount, po.max_amount, po.created_at
            FROM p2p_orders po
            JOIN users u ON po.user_id = u.id
            WHERE po.asset = ? AND po.fiat = ? AND po.status = ?
        '''
        params = [asset, fiat, OrderStatus.PENDING.value]
        
        if order_type:
            query += ' AND po.order_type = ?'
            params.append(order_type)
        
        query += ' ORDER BY po.price ASC'
        
        cursor.execute(query, params)
        results = cursor.fetchall()
        conn.close()
        
        orders = []
        for result in results:
            payment_methods = json.loads(result[9])
            orders.append(P2POrder(
                id=result[0], user_id=result[1], username=result[2],
                order_type=OrderType(result[3]), asset=result[4], fiat=result[5],
                price=result[6], quantity=result[7], available_quantity=result[8],
                payment_methods=payment_methods, status=OrderStatus(result[10]),
                min_amount=result[11], max_amount=result[12], created_at=result[13]
            ))
        
        return orders
    
    def start_trade(self, buyer_id: int, order_id: int, quantity: float) -> Optional[int]:
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT user_id, order_type, asset, fiat, price, available_quantity, 
                       min_amount, max_amount
                FROM p2p_orders WHERE id = ? AND status = ?
            ''', (order_id, OrderStatus.PENDING.value))
            
            order_data = cursor.fetchone()
            if not order_data:
                return None
            
            seller_id, order_type, asset, fiat, price, available_quantity, min_amount, max_amount = order_data
            
            amount = price * quantity
            
            if quantity > available_quantity:
                return None
            if amount < min_amount or amount > max_amount:
                return None
            
            # Validar fondos
            if order_type == 'SELL':
                cursor.execute('''
                    SELECT balance FROM wallets WHERE user_id = ? AND asset = ?
                ''', (buyer_id, fiat))
                buyer_balance = cursor.fetchone()
                if not buyer_balance or buyer_balance[0] < amount:
                    return None
            else:
                cursor.execute('''
                    SELECT balance FROM wallets WHERE user_id = ? AND asset = ?
                ''', (buyer_id, asset))
                buyer_balance = cursor.fetchone()
                if not buyer_balance or buyer_balance[0] < quantity:
                    return None
            
            # Bloquear fondos
            if order_type == 'SELL':
                cursor.execute('''
                    UPDATE wallets SET balance = balance - ?, locked_balance = locked_balance + ? 
                    WHERE user_id = ? AND asset = ?
                ''', (amount, amount, buyer_id, fiat))
            else:
                cursor.execute('''
                    UPDATE wallets SET balance = balance - ?, locked_balance = locked_balance + ? 
                    WHERE user_id = ? AND asset = ?
                ''', (quantity, quantity, buyer_id, asset))
            
            # Actualizar orden
            new_available_quantity = available_quantity - quantity
            new_status = OrderStatus.FILLED.value if new_available_quantity == 0 else OrderStatus.PARTIALLY_FILLED.value
            
            cursor.execute('''
                UPDATE p2p_orders 
                SET available_quantity = ?, status = ?
                WHERE id = ?
            ''', (new_available_quantity, new_status, order_id))
            
            # Crear trade
            created_at = datetime.datetime.now().isoformat()
            deadline = (datetime.datetime.now() + datetime.timedelta(minutes=15)).isoformat()
            
            cursor.execute('''
                INSERT INTO trades 
                (buyer_id, seller_id, order_id, asset, fiat, price, quantity, amount, 
                 status, created_at, payment_deadline)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (buyer_id, seller_id, order_id, asset, fiat, price, quantity, amount, 
                  TradeStatus.PENDING_PAYMENT.value, created_at, deadline))
            
            trade_id = cursor.lastrowid
            conn.commit()
            conn.close()
            return trade_id
            
        except Exception as e:
            print(f"Error starting trade: {e}")
            return None
    
    def confirm_payment(self, trade_id: int) -> bool:
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT buyer_id, seller_id, order_id, asset, fiat, price, quantity, amount, status 
                FROM trades WHERE id = ? AND status = ?
            ''', (trade_id, TradeStatus.PENDING_PAYMENT.value))
            
            trade_data = cursor.fetchone()
            if not trade_data:
                return False
            
            buyer_id, seller_id, order_id, asset, fiat, price, quantity, amount, status = trade_data
            
            cursor.execute('SELECT order_type FROM p2p_orders WHERE id = ?', (order_id,))
            order_type_result = cursor.fetchone()
            if not order_type_result:
                return False
            
            order_type = order_type_result[0]
            
            if order_type == 'SELL':
                # Liberar fondos y transferir
                cursor.execute('''
                    UPDATE wallets SET locked_balance = locked_balance - ? 
                    WHERE user_id = ? AND asset = ?
                ''', (amount, buyer_id, fiat))
                
                cursor.execute('''
                    UPDATE wallets SET balance = balance + ? 
                    WHERE user_id = ? AND asset = ?
                ''', (amount, seller_id, fiat))
                
                cursor.execute('''
                    UPDATE wallets SET locked_balance = locked_balance - ? 
                    WHERE user_id = ? AND asset = ?
                ''', (quantity, seller_id, asset))
                
                cursor.execute('''
                    UPDATE wallets SET balance = balance + ? 
                    WHERE user_id = ? AND asset = ?
                ''', (quantity, buyer_id, asset))
                
            else:
                cursor.execute('''
                    UPDATE wallets SET locked_balance = locked_balance - ? 
                    WHERE user_id = ? AND asset = ?
                ''', (quantity, buyer_id, asset))
                
                cursor.execute('''
                    UPDATE wallets SET balance = balance + ? 
                    WHERE user_id = ? AND asset = ?
                ''', (quantity, seller_id, asset))
                
                cursor.execute('''
                    UPDATE wallets SET locked_balance = locked_balance - ? 
                    WHERE user_id = ? AND asset = ?
                ''', (amount, seller_id, fiat))
                
                cursor.execute('''
                    UPDATE wallets SET balance = balance + ? 
                    WHERE user_id = ? AND asset = ?
                ''', (amount, buyer_id, fiat))
            
            # Actualizar trade
            cursor.execute('''
                UPDATE trades SET status = ? WHERE id = ?
            ''', (TradeStatus.COMPLETED.value, trade_id))
            
            conn.commit()
            conn.close()
            return True
            
        except Exception as e:
            print(f"Error confirming payment: {e}")
            return False
    
    def get_trade_status(self, trade_id: int) -> Optional[str]:
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        
        cursor.execute('SELECT status FROM trades WHERE id = ?', (trade_id,))
        result = cursor.fetchone()
        conn.close()
        
        return result[0] if result else None
    
    def get_user_balance(self, user_id: int) -> Dict[str, Dict[str, float]]:
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT asset, balance, locked_balance FROM wallets WHERE user_id = ?
        ''', (user_id,))
        
        results = cursor.fetchall()
        conn.close()
        
        balance = {}
        for asset, bal, locked in results:
            balance[asset] = {
                'available': bal,
                'locked': locked,
                'total': bal + locked
            }
        
        return balance

# Sistema P2P global
p2p_system = P2PSystem()

# HTML Templates simplificados
HTML_TEMPLATES = {
    'base': '''
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: Arial, sans-serif;
            background: #0a0a0a;
            color: #ffffff;
            line-height: 1.6;
        }}

        .navbar {{
            background: #111;
            padding: 1rem 0;
            border-bottom: 1px solid #333;
        }}

        .nav-container {{
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 2rem;
        }}

        .nav-logo h2 {{
            color: #00ff88;
            font-weight: bold;
        }}

        .nav-menu {{
            display: flex;
            align-items: center;
            gap: 1rem;
        }}

        .nav-user {{
            background: #222;
            padding: 0.5rem 1rem;
            border-radius: 5px;
        }}

        .nav-link {{
            color: #fff;
            text-decoration: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
        }}

        .nav-link:hover {{
            background: #333;
        }}

        .container {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }}

        .auth-container {{
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 80vh;
        }}

        .auth-card {{
            background: #111;
            border: 1px solid #333;
            padding: 2rem;
            border-radius: 10px;
            width: 100%;
            max-width: 400px;
        }}

        .auth-card h2 {{
            text-align: center;
            margin-bottom: 1.5rem;
            color: #00ff88;
        }}

        .auth-form {{
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }}

        .form-group {{
            display: flex;
            flex-direction: column;
        }}

        .form-group label {{
            margin-bottom: 0.5rem;
            color: #ccc;
        }}

        .form-group input {{
            padding: 0.75rem;
            background: #222;
            border: 1px solid #333;
            border-radius: 5px;
            color: #fff;
        }}

        .btn {{
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 5px;
            font-weight: bold;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            text-align: center;
        }}

        .btn-primary {{
            background: #00ff88;
            color: #000;
        }}

        .btn-success {{
            background: #00ff88;
            color: #000;
        }}

        .btn-warning {{
            background: #ffb800;
            color: #000;
        }}

        .btn-buy {{
            background: #00ff88;
            color: #000;
        }}

        .btn-sell {{
            background: #ff4757;
            color: #fff;
        }}

        .alert {{
            padding: 1rem;
            border-radius: 5px;
            margin-bottom: 1rem;
        }}

        .alert-error {{
            background: #ff4757;
            color: #fff;
        }}

        .alert-success {{
            background: #00ff88;
            color: #000;
        }}

        .test-users {{
            margin-top: 1.5rem;
            padding: 1rem;
            background: #222;
            border-radius: 5px;
            font-size: 0.9rem;
        }}

        .dashboard-header {{
            margin-bottom: 2rem;
        }}

        .dashboard-header h1 {{
            color: #00ff88;
            margin-bottom: 1rem;
        }}

        .user-balance {{
            background: #111;
            border: 1px solid #333;
            padding: 1.5rem;
            border-radius: 10px;
            margin-bottom: 2rem;
        }}

        .balance-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }}

        .balance-item {{
            background: #222;
            padding: 1rem;
            border-radius: 5px;
            border-left: 4px solid #00ff88;
        }}

        .dashboard-content {{
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 2rem;
        }}

        .orders-grid {{
            display: flex;
            flex-direction: column;
            gap: 1rem;
            max-height: 600px;
            overflow-y: auto;
        }}

        .order-card {{
            background: #111;
            border: 1px solid #333;
            padding: 1.5rem;
            border-radius: 10px;
        }}

        .order-card.buy {{
            border-left: 4px solid #00ff88;
        }}

        .order-card.sell {{
            border-left: 4px solid #ff4757;
        }}

        .order-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }}

        .trade-form {{
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
        }}

        .trade-form input {{
            flex: 1;
            padding: 0.5rem;
            background: #222;
            border: 1px solid #333;
            border-radius: 5px;
            color: #fff;
        }}

        .create-order-section {{
            background: #111;
            border: 1px solid #333;
            padding: 1.5rem;
            border-radius: 10px;
            height: fit-content;
        }}

        .order-form {{
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }}

        .form-row {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }}

        .modal {{
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
        }}

        .modal-content {{
            background: #111;
            border: 1px solid #333;
            border-radius: 10px;
            padding: 2rem;
            width: 90%;
            max-width: 400px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
        }}
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <h2>P2P TRADING</h2>
            </div>
            <div class="nav-menu">
                {nav_menu}
            </div>
        </div>
    </nav>
    <div class="container">
        {content}
    </div>
    {modal}
    <script>{script}</script>
</body>
</html>
    ''',
    
    'login': '''
<div class="auth-container">
    <div class="auth-card">
        <h2>Iniciar Sesión</h2>
        {error}
        <form method="POST" class="auth-form">
            <div class="form-group">
                <label>Usuario:</label>
                <input type="text" name="username" required>
            </div>
            <div class="form-group">
                <label>Contraseña:</label>
                <input type="password" name="password" required>
            </div>
            <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
        </form>
        <p style="text-align: center; margin-top: 1rem;">
            ¿No tienes cuenta? <a href="/register" style="color: #00ff88;">Regístrate aquí</a>
        </p>
        <div class="test-users">
            <h4>Usuarios de Prueba:</h4>
            <p><strong>Usuario: trader1 / Contraseña: password123</strong></p>
            <p><strong>Usuario: trader2 / Contraseña: password123</strong></p>
            <p><strong>Usuario: trader3 / Contraseña: password123</strong></p>
        </div>
    </div>
</div>
    ''',
    
    'register': '''
<div class="auth-container">
    <div class="auth-card">
        <h2>Crear Cuenta</h2>
        {error}
        <form method="POST" class="auth-form">
            <div class="form-group">
                <label>Usuario:</label>
                <input type="text" name="username" required>
            </div>
            <div class="form-group">
                <label>Email:</label>
                <input type="email" name="email" required>
            </div>
            <div class="form-group">
                <label>Contraseña:</label>
                <input type="password" name="password" required>
            </div>
            <button type="submit" class="btn btn-primary">Registrarse</button>
        </form>
        <p style="text-align: center; margin-top: 1rem;">
            ¿Ya tienes cuenta? <a href="/login" style="color: #00ff88;">Inicia sesión aquí</a>
        </p>
    </div>
</div>
    ''',
    
    'dashboard': '''
<div class="dashboard">
    <div class="dashboard-header">
        <h1>Mercado P2P</h1>
        
        <div class="user-balance">
            <h3>Tu Billetera</h3>
            <div class="balance-grid">
                {balance_items}
            </div>
        </div>
    </div>

    <div class="dashboard-content">
        <div class="orders-section">
            <h2>Anuncios del Mercado ({orders_count})</h2>
            {message}
            <div class="orders-grid" id="ordersGrid">
                {orders}
            </div>
        </div>

        <div class="create-order-section">
            <h2>Crear Anuncio</h2>
            <form id="createOrderForm" class="order-form">
                <div class="form-row">
                    <div class="form-group">
                        <label>Tipo:</label>
                        <select name="order_type" required>
                            <option value="BUY">COMPRAR</option>
                            <option value="SELL">VENDER</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Activo:</label>
                        <select name="asset" required>
                            <option value="USDT">USDT</option>
                            <option value="BTC">BTC</option>
                            <option value="ETH">ETH</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Moneda:</label>
                        <select name="fiat" required>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Precio:</label>
                        <input type="number" step="0.01" name="price" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Cantidad:</label>
                    <input type="number" step="0.01" name="quantity" required>
                </div>

                <div class="form-group">
                    <label>Mínimo:</label>
                    <input type="number" step="0.01" name="min_amount" required>
                </div>

                <div class="form-group">
                    <label>Máximo:</label>
                    <input type="number" step="0.01" name="max_amount" required>
                </div>

                <button type="submit" class="btn btn-primary">Publicar Anuncio</button>
            </form>
        </div>
    </div>
</div>
    '''
}

class P2PRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        print(f"GET request: {self.path}")
        try:
            if self.path == '/':
                self.send_response(302)
                self.send_header('Location', '/login')
                self.end_headers()
                return
                
            elif self.path == '/login':
                self.serve_login()
            elif self.path == '/register':
                self.serve_register()
            elif self.path == '/dashboard':
                self.serve_dashboard()
            elif self.path == '/logout':
                self.do_logout()
            elif self.path.startswith('/trade_status/'):
                self.handle_trade_status()
            else:
                self.send_error(404)
        except Exception as e:
            print(f"Error in GET: {e}")
            self.send_error(500)
    
    def do_POST(self):
        print(f"POST request: {self.path}")
        try:
            if self.path == '/login':
                self.handle_login()
            elif self.path == '/register':
                self.handle_register()
            elif self.path == '/create_order':
                self.handle_create_order()
            elif self.path == '/start_trade':
                self.handle_start_trade()
            elif self.path == '/confirm_payment':
                self.handle_confirm_payment()
            else:
                self.send_error(404)
        except Exception as e:
            print(f"Error in POST: {e}")
            self.send_error(500)
    
    def get_session(self):
        cookies = self.headers.get('Cookie', '')
        session_data = {}
        for cookie in cookies.split(';'):
            if '=' in cookie:
                key, value = cookie.strip().split('=', 1)
                session_data[key] = value
        return session_data
    
    def set_session(self, key, value):
        self.send_header('Set-Cookie', f'{key}={value}; Path=/')
    
    def serve_login(self, error=None):
        session = self.get_session()
        if 'user_id' in session:
            self.send_response(302)
            self.send_header('Location', '/dashboard')
            self.end_headers()
            return
        
        error_html = f'<div class="alert alert-error">{error}</div>' if error else ''
        content = HTML_TEMPLATES['login'].format(error=error_html)
        self.serve_page('Login - P2P Trading', content, '')
    
    def serve_register(self, error=None):
        session = self.get_session()
        if 'user_id' in session:
            self.send_response(302)
            self.send_header('Location', '/dashboard')
            self.end_headers()
            return
        
        error_html = f'<div class="alert alert-error">{error}</div>' if error else ''
        content = HTML_TEMPLATES['register'].format(error=error_html)
        self.serve_page('Register - P2P Trading', content, '')
    
    def serve_dashboard(self, message=None):
        session = self.get_session()
        if 'user_id' not in session:
            self.send_response(302)
            self.send_header('Location', '/login')
            self.end_headers()
            return
        
        user_id = int(session['user_id'])
        username = session.get('username', 'Usuario')
        
        # Obtener balance
        balance = p2p_system.get_user_balance(user_id)
        balance_items = ''
        for asset, bal in balance.items():
            balance_items += f'''
                <div class="balance-item">
                    <strong>{asset}</strong><br>
                    Disponible: {bal["available"]:.2f}<br>
                    Bloqueado: {bal["locked"]:.2f}<br>
                    Total: {bal["total"]:.2f}
                </div>
            '''
        
        # Obtener órdenes
        orders = p2p_system.get_orders()
        orders_html = ''
        
        for order in orders:
            order_type_class = 'buy' if order.order_type.value == 'BUY' else 'sell'
            order_type_text = 'COMPRA' if order.order_type.value == 'BUY' else 'VENTA'
            
            if order.order_type.value == 'BUY':
                button_class = 'btn-buy'
                button_text = 'Vender'
                action = 'vender'
            else:
                button_class = 'btn-sell' 
                button_text = 'Comprar'
                action = 'comprar'
            
            orders_html += f'''
                <div class="order-card {order_type_class}">
                    <div class="order-header">
                        <strong>{order.username}</strong>
                        <span>{order_type_text}</span>
                        <strong>{order.price} {order.fiat}</strong>
                    </div>
                    <div>
                        <p>Cantidad: {order.available_quantity} {order.asset}</p>
                        <p>Límites: {order.min_amount} - {order.max_amount} {order.fiat}</p>
                        <p>Métodos: {", ".join(order.payment_methods)}</p>
                    </div>
                    <form class="trade-form" onsubmit="startTrade(event, {order.id})">
                        <input type="number" step="0.01" min="{order.min_amount / order.price}" max="{order.available_quantity}" placeholder="Cantidad a {action}" required>
                        <button type="submit" class="btn {button_class}">{button_text}</button>
                    </form>
                </div>
            '''
        
        message_html = f'<div class="alert alert-success">{message}</div>' if message else ''
        content = HTML_TEMPLATES['dashboard'].format(
            balance_items=balance_items,
            orders=orders_html,
            message=message_html,
            orders_count=len(orders)
        )
        
        nav_menu = f'''
            <span class="nav-user">{username}</span>
            <a href="/dashboard" class="nav-link">Inicio</a>
            <a href="/logout" class="nav-link">Salir</a>
        '''
        
        modal = '''
        <div id="tradeModal" class="modal">
            <div class="modal-content">
                <h2>Confirmación de Pago</h2>
                <div style="font-size: 2rem; margin: 1rem 0;" id="countdown">15:00</div>
                <div id="statusMessage">Esperando pago...</div>
                <button class="btn btn-warning" onclick="simulatePayment()" id="simulateBtn">Simular Pago</button>
                <button class="btn btn-primary" onclick="closeModal()" style="margin-top: 1rem; display: none;" id="closeBtn">Finalizar</button>
            </div>
        </div>
        '''
        
        script = '''
        let currentTradeId = null;
        let countdownInterval = null;

        function startTrade(event, orderId) {
            event.preventDefault();
            const form = event.target;
            const quantity = parseFloat(form.querySelector('input').value);
            
            fetch('/start_trade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'order_id': orderId,
                    'quantity': quantity
                })
            })
            .then(response => response.text())
            .then(tradeId => {
                if (tradeId) {
                    currentTradeId = tradeId;
                    showPaymentModal();
                    startCountdown();
                } else {
                    alert('Error al iniciar trade');
                }
            });
        }

        function showPaymentModal() {
            document.getElementById('tradeModal').style.display = 'block';
        }

        function closeModal() {
            document.getElementById('tradeModal').style.display = 'none';
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
            location.reload();
        }

        function startCountdown() {
            let timeLeft = 15 * 60;
            const countdownElement = document.getElementById('countdown');
            
            countdownInterval = setInterval(() => {
                timeLeft--;
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    document.getElementById('statusMessage').textContent = 'Tiempo agotado';
                }
            }, 1000);
        }

        function simulatePayment() {
            document.getElementById('simulateBtn').style.display = 'none';
            document.getElementById('statusMessage').textContent = 'Procesando pago...';
            
            setTimeout(() => {
                fetch('/confirm_payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        'trade_id': currentTradeId
                    })
                })
                .then(response => {
                    if (response.ok) {
                        document.getElementById('statusMessage').textContent = '¡Pago confirmado! Fondos agregados a tu billetera.';
                        document.getElementById('closeBtn').style.display = 'block';
                        if (countdownInterval) {
                            clearInterval(countdownInterval);
                        }
                    }
                });
            }, 2000);
        }

        document.getElementById('createOrderForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(this);
            
            fetch('/create_order', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    alert('Anuncio creado exitosamente!');
                    location.reload();
                } else {
                    alert('Error al crear anuncio');
                }
            });
        });
        '''
        
        self.serve_page('Dashboard - P2P Trading', content, nav_menu, script, modal)
    
    def handle_login(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        params = parse_qs(post_data)
        
        username = params.get('username', [''])[0]
        password = params.get('password', [''])[0]
        
        user = p2p_system.authenticate_user(username, password)
        if user:
            self.send_response(302)
            self.set_session('user_id', str(user.id))
            self.set_session('username', user.username)
            self.send_header('Location', '/dashboard')
            self.end_headers()
        else:
            self.serve_login("Usuario o contraseña incorrectos")
    
    def handle_register(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        params = parse_qs(post_data)
        
        username = params.get('username', [''])[0]
        email = params.get('email', [''])[0]
        password = params.get('password', [''])[0]
        
        if p2p_system.register_user(username, email, password):
            self.send_response(302)
            self.send_header('Location', '/login')
            self.end_headers()
        else:
            self.serve_register("Usuario o email ya existen")
    
    def handle_create_order(self):
        session = self.get_session()
        if 'user_id' not in session:
            self.send_response(401)
            self.end_headers()
            return
        
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        params = parse_qs(post_data)
        
        user_id = int(session['user_id'])
        order_type = params.get('order_type', [''])[0]
        asset = params.get('asset', [''])[0]
        fiat = params.get('fiat', ['USD'])[0]
        price = float(params.get('price', ['0'])[0])
        quantity = float(params.get('quantity', ['0'])[0])
        min_amount = float(params.get('min_amount', ['0'])[0])
        max_amount = float(params.get('max_amount', ['0'])[0])
        
        success = p2p_system.create_order(
            user_id, order_type, asset, fiat, price, quantity,
            [], min_amount, max_amount
        )
        
        if success:
            self.send_response(200)
            self.end_headers()
        else:
            self.send_response(400)
            self.end_headers()
    
    def handle_start_trade(self):
        session = self.get_session()
        if 'user_id' not in session:
            self.send_response(401)
            self.end_headers()
            return
        
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        params = parse_qs(post_data)
        
        buyer_id = int(session['user_id'])
        order_id = int(params.get('order_id', ['0'])[0])
        quantity = float(params.get('quantity', ['0'])[0])
        
        trade_id = p2p_system.start_trade(buyer_id, order_id, quantity)
        
        if trade_id:
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(str(trade_id).encode('utf-8'))
        else:
            self.send_response(400)
            self.end_headers()
    
    def handle_confirm_payment(self):
        session = self.get_session()
        if 'user_id' not in session:
            self.send_response(401)
            self.end_headers()
            return
        
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        params = parse_qs(post_data)
        
        trade_id = int(params.get('trade_id', ['0'])[0])
        
        success = p2p_system.confirm_payment(trade_id)
        
        if success:
            self.send_response(200)
            self.end_headers()
        else:
            self.send_response(400)
            self.end_headers()
    
    def handle_trade_status(self):
        trade_id = int(self.path.split('/')[-1])
        status = p2p_system.get_trade_status(trade_id)
        
        if status:
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(status.encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_logout(self):
        self.send_response(302)
        self.send_header('Set-Cookie', 'user_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/')
        self.send_header('Set-Cookie', 'username=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/')
        self.send_header('Location', '/login')
        self.end_headers()
    
    def serve_page(self, title, content, nav_menu, script='', modal=''):
        full_html = HTML_TEMPLATES['base'].format(
            title=title,
            content=content,
            nav_menu=nav_menu,
            script=script,
            modal=modal
        )
        
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(full_html.encode('utf-8'))

def main():
    print("🚀 Iniciando Sistema P2P Trading...")
    print(f"🌐 Servidor web: http://localhost:{PORT}")
    print("\n👥 Usuarios de prueba:")
    print("   trader1 / password123")
    print("   trader2 / password123") 
    print("   trader3 / password123")
    
    # Inicializar sistema
    global p2p_system
    p2p_system = P2PSystem()
    
    # Abrir navegador
    def open_browser():
        webbrowser.open(f'http://localhost:{PORT}')
    
    threading.Timer(1.5, open_browser).start()
    
    # Iniciar servidor
    with socketserver.TCPServer(("", PORT), P2PRequestHandler) as httpd:
        print(f"✅ Servidor iniciado en puerto {PORT}")
        print("⚠️  Presiona Ctrl+C para detener")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Servidor detenido")

if __name__ == "__main__":
    main()