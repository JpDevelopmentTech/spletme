const Step12 = ({
    nextStep,
    prevStep
}: {
    nextStep: () => void,
    prevStep: () => void
}) => {
    return (
        <div>
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight text-gray-900 sm:mb-6 leding-tight dark:text-white">Detalles de la cuenta</h1>
            <form action="#">
                  <div className="grid gap-5 my-6 sm:grid-cols-2">
                      <div>
                          <label htmlFor="country" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pais</label>
                          <select id="country" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                              <option >Selecciona tu pais</option>
                              <option value="USA">USA</option>
                              <option value="UK">United Kingdom</option>
                              <option value="CA">Canada</option>
                              <option value="FR">France</option>
                              <option value="DE">Germany</option>
                              <option value="ES">Spain</option>
                              <option value="JP">Japan</option>
                              <option value="AUS">Australia</option>
                          </select>
                      </div>
                      <div>
                          <label htmlFor="phone-number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Numero de telefono</label>
                          <input type="number" name="phone-number" id="phone-number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="123 567 890" />
                      </div>
                      <div>
                          <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Direccion de residencia</label>
                          <input type="text" name="address" id="address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Cr 32 Cll 2" />
                      </div>
                      <div>
                          <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Numero de identificación</label>
                          <input type="text" name="address" id="address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="123456789" />
                      </div>
                  </div>
                  <div className="mb-6 space-y-3">
                      <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">Al registrarte, estás creando una cuenta de Flowbite y aceptas los <a className="font-medium text-primary-600 dark:text-primary-500 hover:underline" href="#">Términos de Uso</a> y la <a className="font-medium text-primary-600 dark:text-primary-500 hover:underline" href="#">Política de Privacidad</a> de Flowbite.</label>
                          </div>
                      </div>
                      <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="newsletter" aria-describedby="newsletter" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="newsletter" className="font-light text-gray-500 dark:text-gray-300">Enviame correos con informacion de actualizaciones</label>
                          </div>
                      </div>
                  </div>
                  <div className="flex space-x-3">
                      <button onClick={prevStep} className="text-center items-center w-full py-2.5 sm:py-3.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Atras: Informacion personal</button>
                      <button onClick={nextStep} type="submit" className="w-full text-white bg-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg text-sm px-5 py-2.5 sm:py-3.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Proximo: Distribuidor</button>
                  </div>
              </form>
        </div>
    );
}

export default Step12;
