import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import logo from '../resources/images/genseg.png'
const navigation = [
  { name: 'Gestión Ambiental', href: '#', current: true },
  { name: 'Seguimiento y Desarrollo del Graduado', href: '#', current: false },
  { name: 'Proyección Social y Extensión Cultural', href: '#', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Home() {
  return (
    <Disclosure as="nav" className="bg-Principal">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className=" relative flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex justify-around items-center flex-shrink-0">
              <img
                alt="Your Company"
                src='/resources/images/genseg.png'
                className="h-10 w-10 "

              />
              <p className="text-PrincipalText m-2" >
                Gestor de Proyectos <br/> de la DPSEC
              </p>
            </div>
          </div>

          {/* Opciones de navegación alineadas a la derecha */}
          <div className="hidden sm:block sm:ml-auto">
            <div className="flex space-x-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  aria-current={item.current ? 'page' : undefined}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-PrincipalText hover:bg-gray-700 hover:text-white',
                    'rounded-md px-3 py-2 text-sm font-medium',
                  )}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
            <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              <XMarkIcon className="hidden h-6 w-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
