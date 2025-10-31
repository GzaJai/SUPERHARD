import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../../context/CartContext';
import { 
  Cpu,          
  HardDrive,
  MemoryStick,   
  CircuitBoard,  
  Power,         
  MonitorPlay,   
  Box,           
  CheckCircle, 
  XCircle, 
  ShoppingCart, 
  ArrowLeft, 
  Info,
  AlertTriangle,
  Zap,
  PcCase,
  ChevronRight, ChevronLeft,
  RotateCcw
} from 'lucide-react';
import api from '../../services/api';

const BuildPC = () => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const initialComponentState = {
    procesador: null,
    motherboard: null,
    memoriaRAM: [], // Ahora es un array para múltiples RAM
    placaVideo: null,
    almacenamiento: null,
    gabinete: null,
    fuente: null,
  };
  const [selectedComponents, setSelectedComponents] = useState(initialComponentState);
  const [incluirArmado, setIncluirArmado] = useState(false);
  // ✅ NUEVO: Estado para el wizard
  const [currentStep, setCurrentStep] = useState(0);


  const COSTO_ARMADO = 5000;

  const categorias = {
    procesador: { nombre: 'Procesadores', icon: <Cpu className="w-5 h-5" />, required: true },
    motherboard: { nombre: 'Motherboards', icon: <CircuitBoard className="w-5 h-5" />, required: true },
    memoriaRAM: { nombre: 'Memorias RAM', icon: <MemoryStick className="w-5 h-5" />, required: true, max: 2 },
    placaVideo: { nombre: 'Placas de video', icon: <MonitorPlay className="w-5 h-5" />, required: false },
    almacenamiento: { nombre: 'Almacenamiento', icon: <HardDrive className="w-5 h-5" />, required: true },
    gabinete: { nombre: 'Gabinetes', icon: <Box className="w-5 h-5" />, required: true },
    fuente: { nombre: 'Fuentes de poder', icon: <Power className="w-5 h-5" />, required: true },
  };

  // ✅ NUEVO: Array con el orden de los pasos
  const componentSteps = Object.keys(categorias);

  // ✅ NUEVO: Constante para el paso de resumen
  const summaryStepInfo = { nombre: 'Resumen', icon: <CheckCircle className="w-6 h-6" /> };
  const allSteps = [...componentSteps, 'resumen'];

  const NO_GPU_OPTION = {
    id: 'no-gpu',
    nombre: 'Sin Placa de Video (Gráficos Integrados)',
    precio: 0,
    image: 'https://cdn-icons-png.flaticon.com/512/2943/2943973.png',
    marca: 'Integrados'
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadProductos = async () => {
      try {
        const prods = await api.getProductos();
        setProductos(prods.filter(p => p.disponible));
      } catch (err) {
        console.error('Error cargando productos:', err);
      }
    };
    loadProductos();
  }, []);

  const getCompatibleProducts = (tipo) => {
    const categoriaNombre = categorias[tipo].nombre;
    const { procesador, motherboard } = selectedComponents;

    // Comparación flexible (sin distinguir mayúsculas/minúsculas y espacios)
    let filtered = productos.filter(p => 
      p.categoria?.trim().toLowerCase() === categoriaNombre.trim().toLowerCase()
    );

    // Compatibilidad Motherboard <-> Procesador (Socket)
    if (tipo === 'motherboard' && procesador?.socket) {
      filtered = filtered.filter(p => p.socket === procesador.socket);
    }
    if (tipo === 'procesador' && motherboard?.socket) {
      filtered = filtered.filter(p => p.socket === motherboard.socket);
    }

    // Compatibilidad RAM <-> Motherboard/Procesador (DDR)
    if (tipo === 'memoriaRAM') {
      const socket = procesador?.socket || motherboard?.socket;
      if (socket) {
        const ddrType = (socket === 'AM5' || socket === 'LGA 1700') ? 'DDR5' : 'DDR4';
        filtered = filtered.filter(p => p.ddr === ddrType);
      } else {
        return [];
      }
    }

    return filtered;
  };

  const selectComponent = (tipo, producto) => {
    setSelectedComponents(prev => {
      let newSelection = { ...prev };

      if (tipo === 'memoriaRAM') {
        newSelection.memoriaRAM = [...newSelection.memoriaRAM, producto].slice(0, categorias.memoriaRAM.max || 1);
      } else {
        newSelection[tipo] = producto;
      }

      // Lógica de compatibilidad
      if (tipo === 'procesador' && newSelection.motherboard && producto.socket !== newSelection.motherboard.socket) {
        newSelection.motherboard = null;
      }
      if (tipo === 'motherboard' && newSelection.procesador && producto.socket !== newSelection.procesador.socket) {
        newSelection.procesador = null;
      }

      const socket = newSelection.procesador?.socket || newSelection.motherboard?.socket;
      if (newSelection.memoriaRAM.length > 0 && socket) {
        const ddrType = (socket === 'AM5' || socket === 'LGA 1700') ? 'DDR5' : 'DDR4';
        // Filtra las RAMs que no son compatibles
        newSelection.memoriaRAM = newSelection.memoriaRAM.filter(ram => ram.ddr === ddrType);
      }
      
      return newSelection;
    });

    // ✅ CORREGIDO: El avance se gestiona aquí, después de actualizar el estado, para evitar saltos.
    const isRamFull = tipo === 'memoriaRAM' && (selectedComponents.memoriaRAM.length + 1) === categorias.memoriaRAM.max;
    const isSingleSelection = tipo !== 'memoriaRAM';

    if ((isRamFull || isSingleSelection) && currentStep < componentSteps.length - 1) {
      setTimeout(() => goToNextStep(), 200); // Un pequeño delay para que el usuario vea la selección.
    }
  };

  const removeComponent = (tipo, index = null) => {
    setSelectedComponents(prev => {
      let newSelection = { ...prev };

      if (tipo === 'memoriaRAM') {
        if (index !== null) {
          // Quitar una RAM específica
          newSelection.memoriaRAM = newSelection.memoriaRAM.filter((_, i) => i !== index);
        } else {
          // Quitar todas las RAM
          newSelection.memoriaRAM = [];
        }
      } else {
        newSelection[tipo] = null;
      }

      if (tipo === 'procesador' && !newSelection.motherboard) {
        newSelection.memoriaRAM = [];
      }
      if (tipo === 'motherboard' && !newSelection.procesador) {
        newSelection.memoriaRAM = [];
      }

      return newSelection;
    });
  };

  const calcularTotal = () => {
    const totalComponentes = Object.values(selectedComponents)
      .flat() // Aplanar el array de RAM
      .filter(Boolean)
      .reduce((total, comp) => {
        const price = parseFloat(comp.precio);
        const discount = parseFloat(comp.descuento) || 0;
        const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;
        return total + finalPrice;
      }, 0);

    return incluirArmado ? totalComponentes + COSTO_ARMADO : totalComponentes;
  };

  const verificarCompatibilidad = () => {
    const warnings = [];
    const { placaVideo, procesador } = selectedComponents;

    if (placaVideo?.id === 'no-gpu' && procesador) {
      const tieneGraficosIntegrados = procesador.nombre?.toLowerCase().includes('g') ||
                                      procesador.nombre?.toLowerCase().includes('integrated');
      if (!tieneGraficosIntegrados) {
        warnings.push('ℹ️ Asegúrate de que tu procesador tenga gráficos integrados');
      }
    }

    return warnings;
  };

  const agregarAlCarrito = () => {
    const components = Object.values(selectedComponents)
      .flat() // Aplanar el array de RAM
      .filter(Boolean); // Filtrar nulos

    if (components.length === 0) {
      alert('⚠️ Debes seleccionar al menos un componente');
      return;
    }

    const warnings = verificarCompatibilidad();
    if (warnings.length > 0) {
      const confirmacion = window.confirm(
        `Se detectaron las siguientes advertencias:\n\n${warnings.join('\n')}\n\n¿Deseas continuar?`
      );
      if (!confirmacion) return;
    }

    components.forEach(comp => {
      if (comp.id === 'no-gpu') return;
      addToCart(comp, 1);
    });

    if (incluirArmado) {
      const armadoItem = {
        id: 'servicio-armado',
        nombre: 'Servicio de Armado de PC',
        precio: COSTO_ARMADO,
        categoria: 'Servicios',
        image: 'https://cdn-icons-png.flaticon.com/512/3039/3039386.png',
        cantidad: 1
      };
      
      addToCart(armadoItem, 1);
    }

    alert('✅ Componentes agregados al carrito');
    navigate('/shopping-cart');
  };

  // ✅ NUEVO: Función para reiniciar la build
  const handleResetBuild = () => {
    const confirmReset = window.confirm(
      '¿Estás seguro de que quieres reiniciar tu build? Se perderán todos los componentes seleccionados.'
    );
    if (confirmReset) {
      setSelectedComponents(initialComponentState);
      setIncluirArmado(false);
      setCurrentStep(0);
    }
  };

  const total = calcularTotal();
  const cantidadSeleccionados = Object.entries(selectedComponents).reduce((count, [key, value]) => {
    if (Array.isArray(value)) {
      return count + value.length;
    }
    return value ? count + 1 : count;
  }, 0);
  const warnings = verificarCompatibilidad();

  // ✅ NUEVO: Lógica de navegación del wizard
  const goToNextStep = () => {
    // ✅ CORREGIDO: Usar una función de actualización para evitar saltos dobles.
    // Esto asegura que el avance se base en el estado más reciente,
    // previniendo condiciones de carrera con el avance automático.
    setCurrentStep(current => Math.min(current + 1, allSteps.length - 1));
  };

  const goToPrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  // ✅ NUEVO: Función para saltar a un paso específico
  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const isCurrentStepCompleted = () => {
    const currentCategoryKey = componentSteps[currentStep];
    const selection = selectedComponents[currentCategoryKey];
    const isRequired = categorias[currentCategoryKey].required;
    if (!isRequired) return true;
    return Array.isArray(selection) ? selection.length > 0 : !!selection;
  };

  const areRequiredComponentsSelected = () => {
    return componentSteps.every(step => {
      if (!categorias[step].required) {
        return true; // Los opcionales no bloquean
      }
      const selection = selectedComponents[step];
      return Array.isArray(selection) ? selection.length > 0 : !!selection;
    });
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white p-6">
      <div className="max-w-7xl mx-auto animate-fade-in">
        {/* Header mejorado */}
        <div className="mb-6">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#EEDA00] to-yellow-500 mb-1 italic tracking-tight">
            ARMA TU PC
          </h1>
          <p className="text-gray-400 text-sm">Selecciona los componentes para tu setup ideal. Sistema de compatibilidad inteligente.</p>
        </div>

        {/* Alertas de compatibilidad */}
        {warnings.length > 0 && (
          <div className="mb-6 bg-yellow-900/20 border border-yellow-600/50 rounded-xl p-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-yellow-400 font-semibold mb-1">Advertencias de Compatibilidad</h3>
                <ul className="space-y-1 text-xs text-yellow-200">
                  {warnings.map((warning, idx) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Selector de componentes */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* ✅ NUEVO: Barra de progreso visual para el Wizard */}
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl shadow-lg p-3">
              <div className="flex items-center justify-between gap-1">
                {allSteps.map((stepKey, index) => {
                  const stepDetails = stepKey === 'resumen' ? summaryStepInfo : categorias[stepKey];
                  const selection = selectedComponents[stepKey];
                  const hasSelection = Array.isArray(selection) ? selection.length > 0 : !!selection;
                  const isRequired = stepDetails.required;
                  const isPastStep = index < currentStep;

                  // ✅ NUEVO: Lógica para determinar el color del paso
                  const stepClass = 
                    index === currentStep
                      ? 'bg-[#EEDA00] border-[#EEDA00] text-black' // Paso actual
                      : isPastStep && (!hasSelection && isRequired)
                        ? 'bg-red-500 border-red-500 text-white' // Requerido pero omitido
                        : isPastStep
                          ? 'bg-green-500 border-green-500 text-white' // Completado
                          : 'bg-neutral-700 border-neutral-600 text-gray-400'; // Futuro

                  return (
                    <div key={stepKey} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${stepClass}`}
                        >
                          {isPastStep && hasSelection ? <CheckCircle size={16} /> : stepDetails.icon}
                        </div>
                        <p className={`text-[10px] mt-1.5 text-center transition-colors duration-300 ${
                          index === currentStep ? 'text-[#EEDA00] font-semibold' : 'text-gray-400'
                        }`}>
                          {stepDetails.nombre.split(' ')[0]}
                        </p>
                      </div>
                      <div
                        className={`flex-1 h-1 mx-2 transition-colors duration-500 ${ index < allSteps.length - 1 ? '' : 'hidden' } ${
                          index < currentStep ? 'bg-green-500' : 'bg-neutral-700'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>


            {/* ✅ MODIFICADO: Renderiza solo el paso actual del wizard */}
            {componentSteps.map((tipo, index) => {
              if (index !== currentStep) return null;
              const categoria = categorias[tipo];
              const productosCompatibles = getCompatibleProducts(tipo);
              const seleccionados = Array.isArray(selectedComponents[tipo]) ? selectedComponents[tipo] : (selectedComponents[tipo] ? [selectedComponents[tipo]] : []);
              const puedeAgregarMas = tipo === 'memoriaRAM' ? seleccionados.length < (categoria.max || 1) : seleccionados.length === 0;
              return (
                <div 
                  key={tipo}
                  className={`bg-neutral-800/50 border rounded-xl shadow-lg transition-all duration-300 hover:shadow-yellow-400/10 ${
                    seleccionados.length > 0 
                      ? 'border-green-500/50 shadow-green-500/10' 
                      : categoria.required 
                        ? 'border-yellow-500/30' 
                        : 'border-neutral-700'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-lg font-bold flex items-center gap-2">
                        <span className="text-[#EEDA00]">{categoria.icon}</span>
                        {categoria.nombre}
                        {tipo === 'memoriaRAM' && seleccionados.length > 0 && (
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">
                            {seleccionados.length}/{categorias.memoriaRAM.max} módulos
                          </span>
                        )}
                        {categoria.required && seleccionados.length === 0 && (
                          <span className="text-[11px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full">
                            Requerido
                          </span>
                        )}
                        {seleccionados.length > 0 && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                      </h2>
                      {tipo === 'memoriaRAM' && seleccionados.length > 0 && (
                        <button
                          onClick={() => removeComponent('memoriaRAM')}
                          className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs font-semibold transition-colors hover:bg-red-900/20 px-2 py-1 rounded-lg"
                        >
                          <XCircle className="w-4 h-4" />
                          Quitar todas
                        </button>
                      )}
                    </div>

                    {seleccionados.length > 0 && ( // ✅ ACHICADO: Reducción de espacios y tamaños
                      <div className="space-y-2">
                        {seleccionados.map((seleccionado, index) => (
                          <div key={index} className="bg-gradient-to-r from-neutral-700 to-neutral-700/50 p-2 rounded-lg flex items-center gap-3 border border-green-500/30">
                            <img 
                              src={seleccionado.image}
                              alt={seleccionado.nombre}
                              className="w-16 h-16 object-contain bg-white rounded-lg p-1 shadow-md"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{seleccionado.nombre}</p>
                              <p className="text-xs text-gray-400 mb-1">{seleccionado.marca}</p>
                              {seleccionado.socket && (
                                <span className="inline-block text-[11px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">
                                  Socket: {seleccionado.socket}
                                </span>
                              )}
                              {seleccionado.ddr && (
                                <span className="inline-block text-[11px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded ml-1">
                                  {seleccionado.ddr}
                                </span>
                              )}
                              {seleccionado.potencia && (
                                <span className="inline-block text-[11px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded ml-1">
                                  <Zap className="w-3 h-3 inline mr-1" />
                                  {seleccionado.potencia}W
                                </span>
                              )}
                              {seleccionado.consumo && (
                                <span className="inline-block text-[11px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded ml-1">
                                  TDP: {seleccionado.consumo}W
                                </span>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0">
                              {seleccionado.descuento > 0 ? (
                                <>
                                  <p className="text-gray-400 line-through text-sm">
                                    ${parseFloat(seleccionado.precio).toFixed(2)}
                                  </p>
                                  <p className="text-green-400 font-bold text-lg">
                                    ${(parseFloat(seleccionado.precio) * (1 - seleccionado.descuento / 100)).toFixed(2)}
                                  </p>
                                </>
                              ) : (
                                <p className="text-[#EEDA00] font-bold text-lg">${parseFloat(seleccionado.precio).toFixed(2)}</p>
                              )}
                            </div>
                            <button
                              onClick={() => removeComponent(tipo, tipo === 'memoriaRAM' ? index : null)}
                              className="self-start ml-2 text-red-400 hover:text-red-300 transition-colors"
                              title={`Quitar ${seleccionado.nombre}`}
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {puedeAgregarMas && ( // ✅ ACHICADO: Reducción de espacios y tamaños
                      <div id={`selector-${tipo}`} className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                        {tipo === 'memoriaRAM' && !selectedComponents.procesador && !selectedComponents.motherboard ? (
                          <div className="text-gray-400 col-span-2 p-4 bg-neutral-900/50 rounded-lg text-center flex flex-col items-center justify-center h-32 border border-dashed border-neutral-700">
                            <Info className="w-8 h-8 mb-2 text-blue-400" />
                            <p className="font-semibold text-sm mb-1">Selección Dependiente</p>
                            <p className="text-xs">Primero selecciona un Procesador o Motherboard para ver las RAM compatibles.</p>
                          </div>
                        ) : productosCompatibles.length === 0 && tipo !== 'placaVideo' ? (
                          <p className="text-gray-500 col-span-2 p-4 bg-neutral-900/50 rounded-lg text-center border border-dashed border-neutral-700">
                            No hay productos compatibles disponibles.
                          </p>
                        ) : (
                          <>
                            {tipo === 'placaVideo' && (
                              <button
                                onClick={() => selectComponent('placaVideo', NO_GPU_OPTION)} // ✅ ACHICADO: Reducción de espacios y tamaños
                                className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 hover:from-blue-800/40 hover:to-blue-700/30 p-3 rounded-lg text-center transition-all flex flex-col items-center justify-center gap-1 border-2 border-dashed border-blue-600/50 hover:border-blue-500 min-h-[100px] hover:scale-105 duration-200"
                              >
                                <MonitorPlay className="w-8 h-8 text-blue-400" />
                                <p className="font-semibold text-sm text-blue-300">Gráficos Integrados</p>
                                <p className="text-[11px] text-gray-400">Sin GPU dedicada</p>
                              </button>
                            )}
                            {productosCompatibles.map(prod => (
                              <button
                                key={prod.id}
                                onClick={() => selectComponent(tipo, prod)} // ✅ ACHICADO: Reducción de espacios y tamaños
                                className="bg-neutral-700 hover:bg-neutral-600 p-2 rounded-lg text-left transition-all flex items-center gap-2 hover:ring-2 ring-yellow-400 hover:scale-105 duration-200"
                              >
                                <img
                                  src={prod.image}
                                  alt={prod.nombre}
                                  className="w-14 h-14 object-contain bg-white rounded-lg p-1"
                                />
                                <div className="flex-1 min-w-0"> 
                                  <p className="font-semibold truncate text-xs">{prod.nombre}</p>
                                  {(prod.socket || prod.ddr || prod.consumo) && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {prod.socket && ( // ✅ ACHICADO: Reducción de tamaño de fuente
                                        <span className="text-[11px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">{prod.socket}</span>
                                      )}
                                      {prod.ddr && (
                                        <span className="text-[11px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">
                                          {prod.ddr}
                                        </span>
                                      )}
                                      {prod.potencia && (
                                        <span className="text-[11px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded">
                                          {prod.potencia}W
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  <div className="mt-1">
                                    {prod.descuento > 0 ? (
                                      <><p className="text-gray-500 line-through text-[11px]">${parseFloat(prod.precio).toFixed(2)}</p><p className="text-green-400 font-semibold text-sm">${(parseFloat(prod.precio) * (1 - prod.descuento / 100)).toFixed(2)}</p></>
                                    ) : (
                                      <p className="text-[#EEDA00] font-semibold text-sm">${parseFloat(prod.precio).toFixed(2)}</p>
                                    )}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* ✅ NUEVO: Paso final de Resumen - ACHICADO */}
            {currentStep === componentSteps.length && (
              <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl shadow-lg p-4">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Resumen de tu Build
                </h2>
                <div className="space-y-3">
                  {Object.entries(selectedComponents).map(([tipo, comps]) => {
                    const compArray = Array.isArray(comps) ? comps : [comps];
                    if (compArray.every(c => c === null)) return null;

                    return compArray.map((comp, index) => {
                      if (!comp) return null;
                      const stepIndex = componentSteps.indexOf(tipo);
                      return (
                        <div key={`${tipo}-${index}`} className="bg-neutral-700/50 p-3 rounded-lg flex items-center gap-3">
                          <img
                            src={comp.image}
                            alt={comp.nombre}
                            className="w-16 h-16 object-contain bg-white rounded-lg p-1"
                          />
                          <div className="flex-1">
                            <p className="text-gray-400 text-xs">{categorias[tipo].nombre}</p>
                            <p className="font-semibold text-sm">{comp.nombre}</p>
                            {comp.descuento > 0 ? (
                              <div className="flex items-center gap-2">
                                <p className="text-green-400 font-semibold text-base">
                                  ${(parseFloat(comp.precio) * (1 - comp.descuento / 100)).toFixed(2)}
                                </p>
                                <p className="text-gray-500 line-through text-xs">
                                  ${parseFloat(comp.precio).toFixed(2)}
                                </p>
                              </div>
                            ) : (
                              <p className="text-[#EEDA00] font-semibold text-base">${parseFloat(comp.precio).toFixed(2)}</p>
                            )}
                          </div>
                          <button
                            onClick={() => goToStep(stepIndex)}
                            className="bg-yellow-500 text-black px-3 py-1.5 rounded-lg font-semibold text-sm hover:bg-yellow-600 transition-colors"
                          >
                            Cambiar
                          </button>
                        </div>
                      );
                    });
                  })}
                </div>
                {/* ✅ ELIMINADO: Se quita el botón de agregar al carrito del resumen final */}
              </div>
            )}

            {/* ✅ NUEVO: Botón para finalizar y ver el resumen, en lugar de Siguiente/Anterior */}
            {currentStep < componentSteps.length && ( // ✅ ACHICADO
              <div className="flex justify-end items-center mt-2">
                <button
                  onClick={() => goToStep(componentSteps.length)}
                  disabled={cantidadSeleccionados === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/30 text-sm"
                >
                  Finalizar y Ver Resumen
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

          </div>




          {/* Resumen sticky mejorado */}
          <div className="lg:col-span-1"> 
            <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-800/50 border border-neutral-700 rounded-xl shadow-2xl p-4 sticky top-24 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#EEDA00] to-yellow-500 flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-[#EEDA00]" />
                Tu Build
              </h2>
              
              <div className="space-y-1.5 mb-4">
                {componentSteps.map((tipo) => {
                  const comp = selectedComponents[tipo];
                  const hasSelection = Array.isArray(comp) ? comp.length > 0 : comp;
                  const stepIndex = componentSteps.indexOf(tipo);
                  return (
                    <button 
                      key={tipo} // ✅ ACHICADO
                      onClick={() => goToStep(stepIndex)} // ✅ MODIFICADO: Se añaden efectos de hover y transformación para mayor interactividad
                      className={`w-full text-left flex justify-between items-center text-xs p-2 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-md ${
                        hasSelection
                          ? 'bg-gradient-to-r from-green-900/30 to-green-800/20 border border-green-600/30' 
                          : 'bg-neutral-700/30 border border-neutral-600/30 hover:border-neutral-500' // ✅ ACHICADO: Se quita el hover:border-green-500
                      }`}
                    >
                      <span className="flex items-center gap-2 text-gray-300 capitalize font-medium">
                        <span className={hasSelection ? 'text-green-400' : 'text-gray-500'}>
                          {categorias[tipo].icon}
                        </span>
                        {categorias[tipo].nombre}:
                      </span>
                      <span className={`flex items-center gap-1 ${hasSelection ? 'text-green-400 font-semibold' : 'text-gray-500 italic'}`}>
                        {hasSelection ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            {Array.isArray(comp) ? `${comp.length}x OK` : 'OK'}
                          </>
                        ) : (
                          categorias[tipo].required ? 'Requerido' : 'Opcional'
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Servicio de Armado */}
              <div className="mb-4 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-700/50 rounded-xl p-3 hover:border-purple-600/70 transition-all">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <PcCase className="w-5 h-5 text-purple-400" />
                      <h3 className="text-base font-bold text-purple-300">Servicio de Armado</h3>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">
                      Deja que nuestros expertos armen tu PC con cuidado profesional, 
                      gestión de cables y pruebas completas.
                    </p>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={incluirArmado}
                            onChange={(e) => setIncluirArmado(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-neutral-700 rounded-full peer-checked:bg-purple-600 transition-all duration-300 peer-focus:ring-2 peer-focus:ring-purple-400"></div>
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5"></div>
                        </div>
                        <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">
                          {incluirArmado ? 'Incluido' : 'No incluir'}
                        </span>
                      </label>
                      <span className="text-xl font-black text-purple-400">
                        ${COSTO_ARMADO.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>


              <div className="border-t border-gray-700 pt-3 mb-4">
                <div className="flex justify-between items-center mb-2 text-xs">
                  <span className="text-gray-400">Componentes:</span>
                  <span className="font-bold text-base">
                    {Object.values(selectedComponents).flat().filter(Boolean).length}
                    <span className="text-gray-500"></span>
                  </span>
                </div>
                {incluirArmado && (
                  <div className="flex justify-between items-center mb-2 text-xs text-purple-300 bg-purple-900/20 p-1.5 rounded">
                    <span>+ Servicio de Armado</span>
                    <span className="font-bold">${COSTO_ARMADO.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center mb-1">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#EEDA00] to-yellow-500">
                    ${total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* ✅ REINCORPORADO: Botón para agregar al carrito en la barra lateral */}
              <button // ✅ ACHICADO
                onClick={agregarAlCarrito}
                disabled={!areRequiredComponentsSelected()}
                className="w-full mt-2 bg-gradient-to-r from-[#EEDA00] to-yellow-500 text-black font-bold py-2.5 rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700 flex items-center justify-center gap-2 shadow-lg hover:shadow-yellow-400/30 hover:scale-105 transform text-sm"
              >
                <ShoppingCart className="w-5 h-5" />
                Finalizar y Agregar al Carrito
              </button>

              {/* ✅ NUEVO: Botón para reiniciar la build */}
              <button
                onClick={handleResetBuild}
                disabled={cantidadSeleccionados === 0}
                className="w-full mt-2 bg-red-600 text-white font-bold py-2.5 rounded-lg hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700 flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/30 text-sm"
              >
                <RotateCcw className="w-5 h-5" />
                Reiniciar Build
              </button>


              <button
                onClick={() => navigate('/')}
                className="w-full mt-2 border-2 border-gray-600 text-white font-bold py-2.5 rounded-lg hover:bg-neutral-700 hover:border-gray-500 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver al Inicio
              </button>

              {/* Consejos mejorados */}
              <div className="mt-4 p-3 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-800/50 rounded-lg">
                <p className="text-xs text-blue-300 mb-1.5 flex items-center gap-2 font-bold">
                  <Info className="w-4 h-4" /> 
                  Sistema Inteligente
                </p>
                <ul className="text-[11px] text-gray-400 space-y-1 list-disc list-inside">
                  <li>Los componentes se filtran automáticamente por compatibilidad</li>
                  <li>Asegúrate de que el procesador tenga gráficos integrados si no usas GPU</li>
                  <li>Verifica las advertencias antes de comprar</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(38, 38, 38, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(238, 218, 0, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(238, 218, 0, 0.7);
        }
      `}</style>
    </div>
  );
};

export default BuildPC;