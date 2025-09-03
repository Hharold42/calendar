import { useEffect } from "react";
import { useInitialServices, useInitialMasters } from "../api/queries";

interface DataPreloaderProps {
  children: React.ReactNode;
}

export default function DataPreloader({ children }: DataPreloaderProps) {
  // Загружаем services и masters один раз при запуске приложения
  const { 
    data: services, 
    isLoading: servicesLoading, 
    error: servicesError,
    refetch: refetchServices 
  } = useInitialServices();
  
  const { 
    data: masters, 
    isLoading: mastersLoading, 
    error: mastersError,
    refetch: refetchMasters 
  } = useInitialMasters();

  // Логируем загрузку для отладки
  useEffect(() => {
    if (services) {
      console.log("Services loaded:", services.data.length, "items");
    }
    if (masters) {
      console.log("Masters loaded:", masters.data.length, "items");
    }
  }, [services, masters]);

  // Показываем ошибки в консоли и предлагаем обновить
  useEffect(() => {
    if (servicesError) {
      console.error("Error loading services:", servicesError);
      console.log("You can manually refresh services data");
    }
    if (mastersError) {
      console.error("Error loading masters:", mastersError);
      console.log("You can manually refresh masters data");
    }
  }, [servicesError, mastersError]);

  // Можно показать loading состояние, если нужно
  const isLoading = servicesLoading || mastersLoading;
  
  if (isLoading) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        background: 'rgba(255, 255, 255, 0.8)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div>Loading initial data...</div>
      </div>
    );
  }

  // Если есть ошибки, показываем их пользователю
  if (servicesError || mastersError) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        background: 'rgba(255, 255, 255, 0.9)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 9999,
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div>Error loading initial data</div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          {servicesError && <div>Services: {servicesError.message}</div>}
          {mastersError && <div>Masters: {mastersError.message}</div>}
        </div>
        <button 
          onClick={() => {
            if (servicesError) refetchServices();
            if (mastersError) refetchMasters();
          }}
          style={{
            padding: '8px 16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
