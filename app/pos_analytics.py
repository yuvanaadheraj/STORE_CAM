from fastapi import APIRouter
import pandas as pd
import os

router = APIRouter()
# Match this to your exact file name in the data folder
POS_DATA_PATH = "data/pos_transactions.csv"

@router.get("/api/dashboard/micro-funnels")
def get_micro_funnels():
    if not os.path.exists(POS_DATA_PATH):
        return {"departments": []}
    df = pd.read_csv(POS_DATA_PATH)
    dept_sales = df.groupby('dep_name')['GMV'].sum().reset_index().to_dict(orient='records')
    return {"departments": dept_sales}

@router.get("/api/dashboard/staff-yield")
def get_staff_yield():
    if not os.path.exists(POS_DATA_PATH):
        return {"staff": []}
    df = pd.read_csv(POS_DATA_PATH)
    staff_yield = df.groupby('salesperson_name')['GMV'].sum().reset_index().to_dict(orient='records')
    return {"staff": staff_yield}

@router.get("/api/dashboard/loyalty-ratio")
def get_loyalty_ratio():
    if not os.path.exists(POS_DATA_PATH):
        return {"ratios": {}}
    df = pd.read_csv(POS_DATA_PATH)
    df['is_guest'] = df['customer_name'].apply(lambda x: 'Guest' if str(x).strip().lower() == 'guest' else 'Loyalty')
    cust_type = df.groupby('is_guest')['invoice_number'].nunique().to_dict()
    return {"ratios": cust_type}

@router.get("/api/dashboard/queue-alerts")
def get_queue_alerts():
    if not os.path.exists(POS_DATA_PATH):
        return {"last_checkout_time": None, "status": "inactive"}
    df = pd.read_csv(POS_DATA_PATH)
    last_checkout = pd.to_datetime(df['order_time'].max()).isoformat()
    return {"last_checkout_time": last_checkout, "status": "active"}