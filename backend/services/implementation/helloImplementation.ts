import IHelloService from "../interface/helloInterface";


class HelloService implements IHelloService {
    hello(name: string): string {
        return "Hello, " + (name ? name : "World");
    }
}

export default HelloService;